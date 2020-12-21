import Color from 'color';
import React from 'react';
import {
  View,
  Platform,
  FlatList,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import { Text, Button, Divider, List, ProgressBar } from 'react-native-paper';
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
  FullscreenIllustration,
} from '@components/index';
import { updateDepartments, searchDepartments } from '@redux/actions/api/departments';
import { updateNearSchools, searchSchools } from '@redux/actions/api/schools';
import { updateArticleParams, addArticleQuick } from '@redux/actions/contentData/articles';
import { updateEventParams, addEventQuick } from '@redux/actions/contentData/events';
import { updateLocation } from '@redux/actions/data/location';
import getStyles from '@styles/Styles';
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
import { useTheme, logger, Location, Format, Alert } from '@utils/index';

import LocationListItem from '../components/LocationListItem';
import type { LandingScreenNavigationProp } from '../index';
import getLandingStyles from '../styles/Styles';
import { getNewLocations, LocationItem } from '../utils/getNewLocations';

type WelcomeLocationProps = {
  schoolsNear: (School | SchoolPreload)[];
  departmentsData: (Department | DepartmentPreload)[];
  schoolsSearch: SchoolPreload[];
  departmentsSearch: DepartmentPreload[];
  state: {
    schools: SchoolRequestState;
    departments: DepartmentRequestState;
    location: LocationRequestState;
  };
  location: LocationList;
  navigation: LandingScreenNavigationProp<'SelectLocation'>;
  route: { params?: { goBack?: boolean } };
  account: Account;
};

const WelcomeLocation: React.FC<WelcomeLocationProps> = ({
  schoolsNear,
  departmentsData,
  schoolsSearch,
  departmentsSearch,
  state,
  account,
  location,
  navigation,
  route,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const landingStyles = getLandingStyles(theme);
  const styles = getStyles(theme);

  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = React.useState('');
  const scrollRef = React.createRef<FlatList>();
  const inputRef = React.createRef<Searchbar>();

  // If the user has already been to landing, used to show back buttons
  const hasUserAlreadyBeenToLanding = !!route.params?.goBack;

  const initialLocations: LocationItem[] = [
    ...location.schoolData
      .filter((sch) => location.schools.includes(sch._id))
      .map((sch) => ({
        id: sch._id,
        type: 'school' as const,
        name: sch.name,
        description: sch.address && Format.shortAddress(sch.address),
        departmentIds: sch.departments?.map((dep) => dep._id),
      })),
    ...location.departmentData
      .filter((dep) => location.departments.includes(dep._id))
      .map((dep) => ({
        id: dep._id,
        type: 'department' as const,
        description: `Département ${dep.code}`,
        name: dep.name,
      })),
  ];

  if (location.global) {
    initialLocations.push({ id: 'global', name: 'France entière', type: 'other' });
  }

  const [selectedLocations, setSelectedLocations] = React.useState(initialLocations);
  // For convenience
  const selectedIds = selectedLocations.map((loc) => loc.id);

  const [chipCategory, setChipCategory] = React.useState<
    'schools' | 'departements' | 'regions' | 'other'
  >('schools');

  const [buttonVisible, setButtonVisible] = React.useState(false);
  const [userLocation, setUserLocation] = React.useState(false);
  const [locationError, setLocationError] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);

  React.useEffect(() => {
    updateDepartments('initial');
    Location.getStatus().then(async (status) => {
      if (status === 'yes') {
        setUserLocation(true);
        const coords = await Location.getCoordinates();
        updateNearSchools('initial', coords.latitude, coords.longitude);
      } else if (status === 'no') {
        setButtonVisible(true);
      } else if (status === 'error') {
        setLocationError(true);
      }
      // else can never use location :(
    });
  }, []);

  // Helper functions to add and remove locations,
  // memoized so they don't re-render memoized LocationListItem
  const addLocation = React.useCallback(
    (newLocation: LocationItem) =>
      setSelectedLocations((prevLocations) => [...prevLocations, newLocation]),
    [],
  );
  const removeLocation = React.useCallback(
    (locationId: string) =>
      setSelectedLocations((prevLocations) => prevLocations.filter((loc) => loc.id !== locationId)),
    [],
  );

  const requestUserLocation = () => {
    Location.request().then(async (status) => {
      if (status === 'yes') {
        setUserLocation(true);
        setButtonVisible(false);
        const coords = await Location.getCoordinates();
        updateNearSchools('initial', coords.latitude, coords.longitude);
      } else if (status === 'no') {
        setButtonVisible(false);
      } else if (status === 'error') {
        setLocationError(true);
      }
      // else can never use location :(
    });
  };

  const onSearchChange = (text: string) => {
    if (text !== '') {
      searchSchools('initial', text);
      searchDepartments('initial', text);
    }
  };

  const retry = async () => {
    if (searchText !== '') {
      searchSchools('initial', searchText);
      searchDepartments('initial', searchText);
    } else {
      if (userLocation) {
        const coords = await Location.getCoordinates();
        updateNearSchools('initial', coords.latitude, coords.longitude);
      }
      updateDepartments('initial');
    }
  };

  const next = () => {
    if (chipCategory === 'schools' && searchText) {
      searchSchools('next', searchText);
    } else if (chipCategory === 'departements' || chipCategory === 'regions') {
      if (searchText) {
        searchDepartments('next', searchText);
      } else {
        updateDepartments('next');
      }
    }
  };

  function done() {
    // Sets are arrays that only permit unique values
    const schoolSet: Set<string> = new Set();
    const departmentSet: Set<string> = new Set();
    const schoolDepartmentSet: Set<string> = new Set();
    const otherSet: Set<string> = new Set();

    selectedLocations.forEach((loc) => {
      if (loc.type === 'school') {
        schoolSet.add(loc.id);
        loc.departmentIds?.forEach((depId) => schoolDepartmentSet.add(depId));
      } else if (loc.type === 'department') {
        departmentSet.add(loc.id);
      } else if (loc.type === 'other') {
        otherSet.add(loc.id);
      }
    });

    const schoolIds = Array.from(schoolSet);
    const departmentIds = Array.from(departmentSet);
    const schoolDepartmentIds = Array.from(schoolDepartmentSet);
    const global = otherSet.has('global') || schoolIds.length + departmentIds.length === 0;

    const params = { schools: schoolIds, departments: departmentIds.concat(schoolDepartmentIds) };

    Promise.all([
      updateLocation({
        selected: true,
        global,
        schools: schoolIds,
        departments: departmentIds,
      }),
      updateArticleParams({ global: true, ...params }),
      updateEventParams({ global: true, ...params }),
      ...schoolIds.map((schId) =>
        addArticleQuick('school', schId, selectedLocations.find((loc) => loc.id === schId)!.name),
      ),
      ...schoolIds.map((schId) =>
        addEventQuick('school', schId, selectedLocations.find((loc) => loc.id === schId)!.name),
      ),
      ...departmentIds.map((depId) =>
        addArticleQuick(
          'departement',
          depId,
          selectedLocations.find((loc) => loc.id === depId)!.name,
        ),
      ),
      ...departmentIds.map((depId) =>
        addEventQuick('school', depId, selectedLocations.find((loc) => loc.id === depId)!.name),
      ),
    ]).then(() => {
      if (hasUserAlreadyBeenToLanding) {
        navigation.goBack();
      } else {
        navigation.popToTop();
        navigation.replace('Root', {
          screen: 'Main',
          params: {
            screen: 'Home1',
            params: { screen: 'Home2', params: { screen: 'Article' } },
          },
        });
      }
    });
  }

  const schools = searchText === '' ? schoolsNear : schoolsSearch;
  const departments = searchText === '' ? departmentsData : departmentsSearch;

  // useMemo is used to perform memoization on expensive calculations
  // chipListData will be re-generated if schools or departments change
  const chiplistData = React.useMemo(
    () => ({
      schools: {
        key: 'schools' as const,
        title: 'Écoles',
        data: getNewLocations('school', schools),
      },
      departements: {
        key: 'departements' as const,
        title: 'Départements',
        data: getNewLocations('department', departments),
      },
      regions: {
        key: 'regions' as const,
        title: 'Régions',
        data: getNewLocations('region', departments),
      },
      other: {
        key: 'other' as const,
        title: 'Autre',
        data: getNewLocations('other', []),
      },
    }),
    [schools, departments],
  );

  const shouldCollapseHeader =
    searchFocused ||
    chipCategory !== 'schools' ||
    (chiplistData.schools.data.length !== 0 && !userLocation);

  const ListHeaderComponent = (
    <View>
      <View style={{ alignItems: 'center' }}>
        <CategoriesList
          selected={chipCategory}
          setSelected={setChipCategory}
          categories={Object.values(chiplistData)}
        />
      </View>
      {((searchText === '' &&
        (state.schools.near.loading.initial || state.departments.list.loading.initial)) ||
        (searchText !== '' &&
          (state.schools.search?.loading.initial ||
            state.departments.search?.loading.initial))) && <ProgressBar indeterminate />}
      {((searchText === '' && (state.schools.near.error || state.departments.list.error)) ||
        (searchText !== '' &&
          (state.schools.search?.error || state.departments.search?.error))) && (
        <ErrorMessage
          type="axios"
          error={
            searchText === ''
              ? [state.schools.near.error, state.departments.list.error]
              : [state.schools.search?.error, state.departments.search?.error]
          }
          retry={retry}
          strings={{
            what: 'La récupération des localisations',
            contentSingular: 'La liste de localisations',
            contentPlural: 'Les localisations',
          }}
        />
      )}
      {searchText === '' && chipCategory === 'schools' && schoolsNear.length > 0 ? (
        <View style={{ paddingTop: 5 }}>
          <List.Subheader>Écoles autour de vous</List.Subheader>
          <Divider />
        </View>
      ) : null}
    </View>
  );

  const ITEM_HEIGHT = 68.5714;

  const getItemLayout = React.useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const ListEmptyComponent =
    searchText === '' && chipCategory === 'schools' ? (
      <View>
        {state.schools.near.loading.initial ? null : (
          <View style={[styles.centerIllustrationContainer, styles.container, { marginTop: 50 }]}>
            {locationError ? (
              <View style={{ marginTop: 30 }}>
                <Text>Erreur lors de la récupération des écoles autour de vous</Text>
                <View style={styles.container}>
                  <Button
                    onPress={requestUserLocation}
                    uppercase={Platform.OS !== 'ios'}
                    mode="outlined"
                    style={{ borderRadius: 20 }}
                  >
                    Réessayer
                  </Button>
                </View>
              </View>
            ) : (
              buttonVisible && (
                <View>
                  <Text>Appuyez ci-dessous pour trouver les écoles autour de vous</Text>
                  <View style={styles.container}>
                    <Button
                      onPress={requestUserLocation}
                      uppercase={Platform.OS !== 'ios'}
                      mode="outlined"
                      icon="map-marker"
                      style={{ borderRadius: 20 }}
                    >
                      Me géolocaliser
                    </Button>
                  </View>
                </View>
              )
            )}
          </View>
        )}
      </View>
    ) : (
      <View>
        {(searchText === '' &&
          (state.schools.near.loading.initial || state.departments.list.loading.initial)) ||
        (searchText !== '' &&
          (state.schools.search?.loading.initial ||
            state.departments.search?.loading.initial)) ? null : (
          <View style={styles.centerIllustrationContainer}>
            <Text>Aucun résultat</Text>
          </View>
        )}
      </View>
    );

  const ListFooterComponent = () => (
    <View style={{ minHeight: 50 }}>
      {((searchText === '' &&
        (state.schools.list.loading.next || state.departments.list.loading.next)) ||
        (searchText !== '' &&
          (state.schools.search?.loading.next || state.departments.search?.loading.next))) && (
        <ActivityIndicator size="large" color={colors.primary} />
      )}
    </View>
  );

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const headerElevation = scrollY.interpolate({
    inputRange: [0, 8],
    outputRange: [0, 3],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.page}>
      <TranslucentStatusBar backgroundColor={colors.background} />
      <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'}>
        <View style={{ height: insets.top }} />
        <Animated.View
          style={{
            elevation: headerElevation,
            backgroundColor: colors.background,
            justifyContent: 'flex-end',
          }}
        >
          <CollapsibleView
            collapsed={shouldCollapseHeader}
            style={{ height: userLocation ? 50 : '40%' }}
          >
            {hasUserAlreadyBeenToLanding ? (
              <PlatformBackButton onPress={() => navigation.goBack()} />
            ) : null}
            <View
              style={[
                landingStyles.headerContainer,
                { marginBottom: 0, flex: 1, justifyContent: 'flex-end' },
              ]}
            >
              <View style={landingStyles.centerIllustrationContainer}>
                <CollapsibleView collapsed={userLocation}>
                  <Illustration name="location-select" height={200} width={200} />
                </CollapsibleView>
                <Text style={[landingStyles.sectionTitle, { marginTop: userLocation ? 80 : 0 }]}>
                  Choisissez votre école
                </Text>
              </View>
            </View>
          </CollapsibleView>
          <View style={landingStyles.searchContainer}>
            <Searchbar
              ref={inputRef}
              icon={shouldCollapseHeader && hasUserAlreadyBeenToLanding ? 'arrow-left' : undefined}
              onIconPress={
                shouldCollapseHeader && hasUserAlreadyBeenToLanding ? navigation.goBack : undefined
              }
              placeholder="Rechercher"
              value={searchText}
              onChangeText={setSearchText}
              onIdle={onSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </View>
        </Animated.View>
        <Animated.FlatList<LocationItem>
          ref={scrollRef}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true,
          })}
          keyExtractor={(item) => item.id}
          data={chiplistData[chipCategory].data}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={({ item }) => (
            <LocationListItem
              {...item}
              onAdd={addLocation}
              onRemove={removeLocation}
              selected={selectedIds.includes(item.id)}
            />
          )}
          onEndReached={next}
          onEndReachedThreshold={1}
          getItemLayout={getItemLayout}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        />
        <Divider />
        {state.location.update.loading && <ProgressBar indeterminate />}
        {state.location.update.error && (
          <ErrorMessage
            type="axios"
            error={state.location.update.error}
            strings={{
              what: 'la mise à jour de la localisation',
              contentSingular: 'La localisation',
            }}
            retry={done}
          />
        )}
        <CollapsibleView collapsed={selectedLocations.length === 0}>
          <ChipAddList
            setList={({ key }) => removeLocation(key)}
            data={selectedLocations.map((loc) => ({ title: loc.name, key: loc.id, ...loc }))}
            chipProps={{ icon: 'close', rightAction: true }}
            style={{ marginBottom: 0 }}
          />
        </CollapsibleView>
        <View
          style={[
            landingStyles.contentContainer,
            {
              paddingVertical: 15,
            },
          ]}
        >
          <View style={landingStyles.buttonContainer}>
            <Button
              mode={
                Platform.OS === 'ios' || selectedLocations.length === 0 ? 'outlined' : 'contained'
              }
              color={colors.primary}
              uppercase={Platform.OS !== 'ios'}
              onPress={() => {
                if (selectedLocations.length === 0 && Platform.OS !== 'web') {
                  logger.info('User has not specified a landing location. Showing alert.');
                  Alert.alert(
                    'Ne pas spécifier de localisation?',
                    'Vous verrez uniquement les articles destinés à la france entière',
                    [{ text: 'Annuler' }, { text: 'Continuer', onPress: done }],
                    { cancelable: true },
                  );
                } else {
                  done();
                }
              }}
              style={{ flex: 1 }}
            >
              {selectedLocations.length === 0 ? 'Passer' : 'Confirmer'}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { schools, departments, location, account } = state;
  return {
    schoolsNear: schools.near,
    departmentsData: departments.data,
    schoolsSearch: schools.search,
    departmentsSearch: departments.search,
    location,
    state: {
      schools: schools.state,
      departments: departments.state,
      location: location.state,
    },
    account,
  };
};

export default connect(mapStateToProps)(WelcomeLocation);
