import React from 'react';
import {
  View,
  Platform,
  FlatList,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import { Text, Button, Divider, List, ProgressBar, useTheme, Title } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import {
  TranslucentStatusBar,
  Illustration,
  CategoriesList,
  ErrorMessage,
  CollapsibleView,
  ChipAddList,
  Searchbar,
  PlatformBackButton,
} from '@components';
import { clearArticles } from '@redux/actions/api/articles';
import { updateDepartments, searchDepartments } from '@redux/actions/api/departments';
import { clearEvents } from '@redux/actions/api/events';
import { clearGroups } from '@redux/actions/api/groups';
import { updateNearSchools, searchSchools } from '@redux/actions/api/schools';
import { addArticleQuick } from '@redux/actions/contentData/articles';
import { addEventQuick } from '@redux/actions/contentData/events';
import { updateLocation } from '@redux/actions/data/location';
import {
  School,
  SchoolPreload,
  Department,
  DepartmentPreload,
  SchoolRequestState,
  DepartmentRequestState,
  State,
  LocationRequestState,
  LocationList,
  Account,
} from '@ts/types';
import { logger, Location, Format, Alert, Errors, trackEvent } from '@utils';

import type { LandingScreenNavigationProp } from '.';
import getStyles from './styles';

type WelcomeLocationProps = {
  schoolsNear: (School | SchoolPreload)[];
  schoolsSearch: SchoolPreload[];
  departmentsSearch: DepartmentPreload[];
  state: {
    schools: SchoolRequestState;
    departments: DepartmentRequestState;
    location: LocationRequestState;
  };
  navigation: LandingScreenNavigationProp<any>;
  mode?: 'web' | 'mobile';
};

const WelcomeLocation: React.FC<WelcomeLocationProps> = ({
  schoolsNear,
  schoolsSearch,
  departmentsSearch,
  state,
  navigation,
  mode = 'mobile',
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [searchText, setSearchText] = React.useState('');
  const scrollRef = React.createRef<FlatList>();
  const inputRef = React.createRef<Searchbar>();

  const [locationStatus, setLocationStatus] = React.useState<'yes' | 'no' | 'error' | 'never' | ''>(
    '',
  );
  const [searchFocused, setSearchFocused] = React.useState(false);

  React.useEffect(() => {
    searchNearSchools(false);
  }, []);

  const searchNearSchools = async (request = false) => {
    const status = await (request ? Location.request : Location.getStatus)();
    setLocationStatus(status);
    if (status === 'yes') {
      const coords = await Location.getCoordinates();
      updateNearSchools('initial', coords.latitude, coords.longitude);
    }
  };

  const onSearchChange = (text: string) => {
    if (text) {
      searchSchools('initial', text);
      searchDepartments('initial', text);
    }
  };

  const retry = async () => {
    if (searchText) {
      searchSchools('initial', searchText);
      searchDepartments('initial', searchText);
    } else {
      searchNearSchools();
    }
  };

  function done<
    T extends
      | { type: 'school'; element: SchoolPreload | School }
      | { type: 'department'; element: DepartmentPreload | Department }
      | { type: 'global'; element: undefined }
  >(type: T['type'], element: T['element']) {
    clearArticles(true, true);
    clearEvents(true, true);
    clearGroups(true, true);
    Promise.all(
      type === 'school'
        ? [
            updateLocation({
              selected: true,
              global: false,
              schools: [(element as SchoolPreload)._id],
              departments: [],
            }),
            addArticleQuick(
              'school',
              (element as SchoolPreload)._id,
              (element as SchoolPreload).name,
            ),
            addEventQuick(
              'school',
              (element as SchoolPreload)._id,
              (element as SchoolPreload).name,
            ),
          ]
        : type === 'department'
        ? [
            updateLocation({
              selected: true,
              global: false,
              schools: [],
              departments: [(element as DepartmentPreload)._id],
            }),
            addArticleQuick(
              'departement',
              (element as DepartmentPreload)._id,
              (element as DepartmentPreload).name,
            ),
            addEventQuick(
              'departement',
              (element as DepartmentPreload)._id,
              (element as DepartmentPreload).name,
            ),
          ]
        : [
            updateLocation({
              selected: true,
              global: true,
              schools: [],
              departments: [],
            }),
          ],
    )
      .then(() => {
        navigation.popToTop();
        navigation.replace('Root', {
          screen: 'Main',
          params: {
            screen: 'Home1',
            params: { screen: 'Home2', params: { screen: 'Article' } },
          },
        });
      })
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: 'la mise à jour de la localisation',
          error,
          retry: () => done(type, element),
        }),
      );
  }

  const relevantStates = searchText
    ? [state.schools.search, state.departments.search]
    : [state.schools.near];

  const ListHeaderComponent = (
    <View>
      {relevantStates.some((s) => s?.error) && (
        <ErrorMessage
          type="axios"
          error={relevantStates.map((s) => s?.error)}
          retry={retry}
          strings={{
            what: 'La récupération des localisations',
            contentSingular: 'La liste de localisations',
            contentPlural: 'Les localisations',
          }}
        />
      )}
      {!searchText && schoolsNear.length > 0 ? (
        <View style={{ paddingTop: 5 }}>
          <List.Subheader>Écoles autour de vous</List.Subheader>
          <Divider />
        </View>
      ) : null}
    </View>
  );

  const ListEmptyComponent = () => {
    if (
      !searchText &&
      !state.schools.near.loading.initial &&
      Platform.OS !== 'web' &&
      (locationStatus === 'no' || locationStatus === 'error')
    ) {
      return (
        <View style={[styles.centerIllustrationContainer, styles.container, { marginTop: 50 }]}>
          <Text>
            {locationStatus === 'no'
              ? 'Appuyez ci-dessous pour trouver les écoles autour de vous'
              : 'Erreur lors de la recherche des écoles autour de vous'}
          </Text>
          <View style={styles.container}>
            <Button
              onPress={() => {
                trackEvent('landing:press-locate-button');
                searchNearSchools(true);
              }}
              uppercase={Platform.OS !== 'ios'}
              mode="outlined"
              icon="map-marker"
              style={{ borderRadius: 20 }}
            >
              {locationStatus === 'no' ? 'Rechercher autour de moi' : 'Réessayer'}
            </Button>
          </View>
        </View>
      );
    }
    if (!relevantStates.some((s) => s?.loading.initial) && searchText) {
      return (
        <View style={styles.centerIllustrationContainer}>
          <Text>Aucun résultat</Text>
        </View>
      );
    }
    return null;
  };

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const headerElevation = scrollY.interpolate({
    inputRange: [0, 8],
    outputRange: [0, 3],
    extrapolate: 'clamp',
  });

  const data = (searchText
    ? [
        ...schoolsSearch.map((s) => ({ ...s, element: 'school' })).slice(0, 3),
        ...departmentsSearch.map((d) => ({ ...d, element: 'department' })),
        ...schoolsSearch.map((s) => ({ ...s, element: 'school' })).slice(3),
      ]
    : schoolsNear.map((s) => ({ ...s, element: 'school' }))) as (
    | ((SchoolPreload | School) & { element: 'school' })
    | ((DepartmentPreload | Department) & { element: 'department' })
  )[];

  return (
    <View style={styles.page}>
      <TranslucentStatusBar backgroundColor={colors.background} />
      <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'} style={{ flex: 1 }}>
        <View style={{ height: insets.top }} />
        <Animated.View
          style={{
            elevation: headerElevation,
            backgroundColor: colors.background,
          }}
        >
          <CollapsibleView collapsed={!!(searchText || searchFocused)}>
            <View style={styles.centerIllustrationContainer}>
              {mode === 'web' ? (
                <View style={{ height: 'calc(45vh - 210px)' }} />
              ) : (
                <CollapsibleView collapsed={schoolsNear.length > 0}>
                  <Illustration name="location-select" />
                </CollapsibleView>
              )}
              <Title style={{ fontSize: 24, paddingTop: schoolsNear.length ? 20 : 0 }}>
                Choisissez votre école
              </Title>
            </View>
          </CollapsibleView>
          <View style={styles.searchContainer}>
            <Searchbar
              ref={inputRef}
              icon="magnify"
              placeholder="Rechercher"
              value={searchText}
              onChangeText={setSearchText}
              onIdle={onSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={
                relevantStates.some((s) => s?.loading.initial)
                  ? { borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }
                  : undefined
              }
            />
            {relevantStates.some((s) => s?.loading.initial) ? (
              <ProgressBar
                indeterminate
                style={{
                  marginTop: Platform.OS === 'web' ? -4 : 0,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }}
              />
            ) : (
              <View style={{ height: 4 }} />
            )}
          </View>
        </Animated.View>
        <Animated.FlatList<
          | ((SchoolPreload | School) & { element: 'school' })
          | ((DepartmentPreload | Department) & { element: 'department' })
        >
          ref={scrollRef}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true,
          })}
          keyExtractor={(item) => item._id}
          data={data}
          style={width >= 1200 ? { width: 560, alignSelf: 'center' } : {}}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={
                item.element === 'school'
                  ? `${item.address?.address?.city}, ${
                      item.departments?.length
                        ? item.departments[0].displayName
                        : 'Département inconnu'
                    }`
                  : `${item.type === 'departement' ? 'Département' : 'Région'}, ${item.code}`
              }
              descriptionNumberOfLines={1}
              onPress={() => {
                done(item.element, item);
              }}
            />
          )}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        />
        {mode === 'mobile' && (
          <CollapsibleView collapsed={!!(searchText || searchFocused)}>
            <Divider />
            <View
              style={[styles.container, styles.buttonContainer, { marginBottom: insets.bottom }]}
            >
              <Button
                mode="text"
                uppercase={Platform.OS !== 'ios'}
                onPress={() => done('global', undefined)}
              >
                Passer
              </Button>
            </View>
          </CollapsibleView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { schools, departments, location } = state;
  return {
    schoolsNear: schools.near,
    schoolsSearch: schools.search,
    departmentsSearch: departments.search,
    state: {
      schools: schools.state,
      departments: departments.state,
      location: location.state,
    },
  };
};

export default connect(mapStateToProps)(WelcomeLocation);
