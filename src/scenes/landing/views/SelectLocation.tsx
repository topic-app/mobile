import React from 'react';
import {
  View,
  Platform,
  Alert,
  FlatList,
  TextInput as RNTextInput,
  ActivityIndicator,
} from 'react-native';
import { Text, useTheme, Button, Divider, List, Checkbox, ProgressBar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import {
  School,
  SchoolPreload,
  Department,
  DepartmentPreload,
  SchoolRequestState,
  DepartmentRequestState,
  State,
  LocationRequestState,
} from '@ts/types';
import { logger } from '@utils/index';
import { updateLocation } from '@redux/actions/data/location';
import { updateArticleParams, addArticleQuick } from '@redux/actions/contentData/articles';
import { updateEventParams } from '@redux/actions/contentData/events';
import { updateSchools, updateNearSchools, searchSchools } from '@redux/actions/api/schools';
import { updateDepartments, searchDepartments } from '@redux/actions/api/departments';
import {
  TranslucentStatusBar,
  Illustration,
  CategoriesList,
  ErrorMessage,
  CollapsibleView,
  ChipAddList,
  Searchbar,
} from '@components/index';

import getStyles from '@styles/Styles';

import type { LandingStackParams } from '../index';
import getLandingStyles from '../styles/Styles';

type Navigation = StackNavigationProp<LandingStackParams, 'SelectLocation'>;

// TODO: Externalize into @ts/redux
type ReduxLocation = {
  global: boolean;
  schools: string[];
  departments: string[];
  schoolData: SchoolPreload[];
  departmentData: DepartmentPreload[];
};

type PersistantData = {
  key: string;
  title: string;
  description: string;
  type: 'school' | 'department' | 'region' | 'other';
  departments?: DepartmentPreload[];
};

function done(
  selectedSchools: string[],
  selectedDepartments: string[],
  selectedOthers: string[],
  navigation: Navigation,
  persistentData: PersistantData[],
  goBack: boolean,
) {
  selectedSchools = selectedSchools.filter((s) => !!s);
  selectedDepartments = selectedDepartments.filter((s) => !!s);
  const params = {
    schools: selectedSchools,
    departments: [
      ...selectedDepartments,
      // Todo: logic to select extra departments
      ...selectedSchools
        .map((s) => persistentData.find((p) => p.key === s)?.departments)
        .flat()
        .map((d: Department) => d?._id),
    ],
    global: true,
  };
  Promise.all([
    updateLocation({
      selected: true,
      schools: selectedSchools,
      departments: selectedDepartments,
      global: selectedOthers.includes('global'),
    }),
    updateArticleParams(params),
    updateEventParams(params),
  ]).then(() => {
    if (goBack) {
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

type DataType = {
  key: string;
  title: string;
  description: string;
  type: 'school' | 'department' | 'region' | 'other';
  departments?: DepartmentPreload[];
};

function getData(
  type: 'school' | 'departement' | 'region' | 'other',
  locationData: (School | SchoolPreload)[] | (Department | DepartmentPreload)[],
) {
  let data: DataType[] = [
    {
      key: 'global',
      title: 'France entière',
      description: "Pas de département ou d'école spécifique",
      type: 'other',
    },
  ];

  if (type === 'school') {
    data = (locationData as School[])?.map((s) => {
      return {
        key: s._id,
        title: s.name,
        description: `${s?.address?.shortName || s?.address?.address?.city || 'Ville inconnue'}${
          s?.departments?.length !== 0
            ? `, ${s?.departments?.[0]?.displayName || s?.departments?.[0]?.name || 'Inconnu'}`
            : ''
        }`,
        type: 'school',
        departments: s.departments,
      };
    });
  } else if (type === 'departement' || type === 'region') {
    data = (locationData as Department[])
      // TODO: Change to Region | Department in the future
      ?.filter((d) => d.type === type)
      ?.map((d: Department) => {
        return {
          key: d._id,
          title: d.name,
          description: `${type === 'departement' ? 'Département' : 'Région'} ${d.code || ''}`,
          type: 'department',
        };
      });
  }
  return data;
}

type Props = {
  schoolsNear: (School | SchoolPreload)[];
  departments: (Department | DepartmentPreload)[];
  schoolsSearch: SchoolPreload[];
  departmentsSearch: DepartmentPreload[];
  state: {
    schools: SchoolRequestState;
    departments: DepartmentRequestState;
    location: LocationRequestState;
  };
  location?: ReduxLocation;
  navigation: Navigation;
  route: { params?: { goBack?: boolean } };
};

const WelcomeLocation: React.FC<Props> = ({
  schoolsNear,
  departments,
  schoolsSearch,
  departmentsSearch,
  state,
  location = {
    global: false,
    schools: [],
    departments: [],
    schoolData: [],
    departmentData: [],
  },
  navigation,
  route,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const landingStyles = getLandingStyles(theme);
  const styles = getStyles(theme);

  const goBack = route.params?.goBack ?? false;

  const [searchText, setSearchText] = React.useState('');
  const scrollRef = React.createRef<FlatList>();
  const inputRef = React.createRef<RNTextInput>();

  const [selectedSchools, setSelectedSchools] = React.useState(location.schools || []);
  const [selectedDepartments, setSelectedDepartments] = React.useState(location.departments || []);
  const [selectedOthers, setSelectedOthers] = React.useState(location.global ? ['global'] : []);

  const [buttonVisible, setButtonVisible] = React.useState(false);
  const [userLocation, setUserLocation] = React.useState(false);

  React.useEffect(() => {
    // Check if Location is requestable
    // If it is, then show the FAB to go to location
    Permissions.getAsync(Permissions.LOCATION)
      .then(async ({ status, canAskAgain }) => {
        // User previously granted permission
        if (status === Location.PermissionStatus.GRANTED) {
          logger.verbose('Location previously granted, showing location FAB');
          setButtonVisible(true);
          setUserLocation(true);
          const { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          updateNearSchools('initial', coords.latitude, coords.longitude);
        } else if (status === Location.PermissionStatus.DENIED && canAskAgain) {
          logger.info('Location previously denied but can ask again, showing location FAB');
          setButtonVisible(true);
        } else {
          logger.info('Location denied, hiding location FAB');
        }
      })
      .catch((e) => logger.error('Error while requesting user location permission', e));
  }, []);

  const requestUserLocation = async () => {
    let status, canAskAgain;
    try {
      const permission = await Permissions.askAsync(Permissions.LOCATION);
      status = permission.status;
      canAskAgain = permission.canAskAgain;
    } catch (e) {
      logger.error('Error while requesting user location', e);
    }
    if (status === 'granted') {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      updateNearSchools('initial', coords.latitude, coords.longitude);
    } else {
      if (!canAskAgain) {
        setButtonVisible(false);
      }
      logger.info('Location permission request prompt denied, hiding location FAB.');
    }
  };

  type CategoryType = 'schools' | 'departements' | 'regions' | 'other';
  const [category, setCategory] = React.useState<CategoryType>('schools');
  const [chipCategory, setChipCategory] = React.useState<CategoryType>(category);

  const searchChange = (text: string) => {
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
        const { coords } = await Location.getCurrentPositionAsync({});
        updateNearSchools('initial', coords.latitude, coords.longitude);
      }
      updateDepartments('initial');
    }
  };

  const next = () => {
    if (category === 'schools') {
      if (searchText) {
        searchSchools('next', searchText);
      }
    } else if (category === 'departements' || category === 'regions') {
      if (searchText) {
        searchDepartments('next', searchText);
      } else {
        updateDepartments('next');
      }
    }
  };
  const categoryData = {
    schools: {
      title: 'Écoles',
      key: 'schools',
      data: getData('school', searchText === '' ? schoolsNear : schoolsSearch),
    },
    departements: {
      title: 'Départements',
      key: 'departements',
      data: getData('departement', searchText === '' ? departments : departmentsSearch),
    },
    regions: {
      title: 'Régions',
      key: 'regions',
      data: getData('region', searchText === '' ? departments : departmentsSearch),
    },
    other: {
      title: 'Autre',
      key: 'other',
      data: getData('other', []),
    },
  };

  const [persistentData, setPersistentData] = React.useState<PersistantData[]>([
    ...location.schoolData.map(
      (s): PersistantData => ({ key: s._id, title: s.name, type: 'school' }),
    ),
    ...location.departmentData.map(
      (d): PersistantData => ({ key: d._id, title: d.name, type: 'department' }),
    ),
    { key: 'global', title: 'France entière', type: 'other' },
  ]);

  const renderItem = React.useCallback(
    ({ item }: { item: DataType }) => {
      const [selected, setSelected] = {
        school: [selectedSchools, setSelectedSchools] as const,
        department: [selectedDepartments, setSelectedDepartments] as const,
        region: [selectedDepartments, setSelectedDepartments] as const,
        other: [selectedOthers, setSelectedOthers] as const,
      }[item.type];
      return (
        <List.Item
          title={item.title}
          description={item.description}
          descriptionNumberOfLines={1}
          onPress={() => {
            if (selected.includes(item.key)) {
              setSelected(selected.filter((s) => s !== item.key));
            } else {
              setSelected([...selected, item.key]);
              setPersistentData([...persistentData, item]);
            }
          }}
          left={() =>
            Platform.OS !== 'ios' ? (
              <View style={{ alignSelf: 'center' }}>
                <Checkbox
                  status={selected.includes(item.key) ? 'checked' : 'unchecked'}
                  color={colors.primary}
                />
              </View>
            ) : null
          }
          right={() =>
            Platform.OS === 'ios' ? (
              <View style={{ alignSelf: 'center' }}>
                <Checkbox
                  status={selected.includes(item.key) ? 'checked' : 'unchecked'}
                  color={colors.primary}
                />
              </View>
            ) : null
          }
        />
      );
    },
    [selectedSchools, selectedDepartments, selectedOthers],
  );

  const ListHeaderComponent = (
    <View>
      <TranslucentStatusBar backgroundColor={colors.background} />
      <View style={landingStyles.headerContainer}>
        <View style={landingStyles.centerIllustrationContainer}>
          <CollapsibleView collapsed={!!searchText}>
            <Illustration name="location-select" height={200} width={200} />
          </CollapsibleView>
          <View style={!!searchText && { marginTop: 30 }}>
            <Text style={landingStyles.sectionTitle}>Choisissez votre école</Text>
          </View>
        </View>
      </View>
      <View style={landingStyles.searchContainer}>
        <Searchbar
          ref={inputRef}
          placeholder="Rechercher"
          value={searchText}
          onChangeText={setSearchText}
          onIdle={searchChange}
        />
      </View>
      <CategoriesList
        selected={chipCategory}
        setSelected={(type: CategoryType) => {
          setChipCategory(type);
          setCategory(type);
        }}
        categories={Object.values(categoryData).map((s) => ({ title: s.title, key: s.key }))}
      />
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
        />
      )}
      {searchText === '' && category === 'schools' && schoolsNear.length > 0 ? (
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
    searchText === '' && category === 'schools' ? (
      <View>
        {state.schools.near.loading.initial || userLocation || !buttonVisible ? null : (
          <View style={[styles.centerIllustrationContainer, styles.container, { marginTop: 100 }]}>
            <Text style={{ maxWidth: 300, alignContent: 'center' }}>
              Recherchez votre école
              {buttonVisible ? 'ou appuyez ci-dessous pour trouver les écoles autour de vous' : ''}
            </Text>
            {buttonVisible && (
              <View style={styles.container}>
                <Button
                  onPress={requestUserLocation}
                  uppercase={Platform.OS !== 'ios'}
                  mode="outlined"
                  style={{ borderRadius: 20 }}
                >
                  Me géolocaliser
                </Button>
              </View>
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

  const ListFooterComponent = (
    <View style={{ minHeight: 50 }}>
      {((searchText === '' &&
        (state.schools.list.loading.next || state.departments.list.loading.next)) ||
        (searchText !== '' &&
          (state.schools.search?.loading.next || state.departments.search?.loading.next))) && (
        <ActivityIndicator size="large" color={colors.primary} />
      )}
    </View>
  );

  const selected = [...selectedSchools, ...selectedDepartments, ...selectedOthers];

  return (
    <View style={styles.page}>
      <FlatList
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        ListHeaderComponent={ListHeaderComponent}
        data={categoryData[category].data}
        getItemLayout={getItemLayout}
        onEndReached={next}
        onEndReachedThreshold={1}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        renderItem={renderItem}
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
          retry={() =>
            done(
              selectedSchools,
              selectedDepartments,
              selectedOthers,
              navigation,
              persistentData,
              goBack,
            )
          }
        />
      )}
      <View style={{ marginBottom: -20 }}>
        <CollapsibleView collapsed={selected.length !== 0}>
          <View style={landingStyles.contentContainer}>
            <Text>
              Par défaut, vous verrez les articles destinés à votre école, ainsi que les articles du
              département dans lequel elle se trouve et de la France entière
            </Text>
          </View>
        </CollapsibleView>

        <CollapsibleView collapsed={selected.length === 0}>
          <ChipAddList
            setList={(item) => {
              const [data, setData] = {
                school: [selectedSchools, setSelectedSchools] as const,
                department: [selectedDepartments, setSelectedDepartments] as const,
                region: [selectedDepartments, setSelectedDepartments] as const,
                other: [selectedOthers, setSelectedOthers] as const,
              }[item.type as PersistantData['type']];
              setData(data.filter((i) => i !== item.key));
            }}
            data={selected.map((s) => persistentData.find((p) => p.key === s)!)}
            chipProps={{ icon: 'close', rightAction: true }}
          />
        </CollapsibleView>
      </View>
      <View style={landingStyles.contentContainer}>
        <View style={landingStyles.buttonContainer}>
          <Button
            mode={
              Platform.OS === 'ios' ||
              !(selectedSchools.length || selectedDepartments.length || selectedOthers.length)
                ? 'outlined'
                : 'contained'
            }
            color={colors.primary}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {
              if (selected.length === 0) {
                logger.info('User has not specified a landing location. Showing alert.');
                if (Platform.OS !== 'web') {
                  Alert.alert(
                    'Ne pas spécifier de localisation?',
                    'Vous verrez uniquement les articles destinés à la france entière',
                    [
                      {
                        text: 'Annuler',
                      },
                      {
                        text: 'Continuer',
                        onPress: () =>
                          done(
                            selectedSchools,
                            selectedDepartments,
                            selectedOthers,
                            navigation,
                            persistentData,
                            goBack,
                          ),
                      },
                    ],
                    { cancelable: true },
                  );
                } else {
                  done(
                    selectedSchools,
                    selectedDepartments,
                    selectedOthers,
                    navigation,
                    persistentData,
                    goBack,
                  );
                }
              } else {
                logger.info('User selected locations', selected);
                done(
                  selectedSchools,
                  selectedDepartments,
                  selectedOthers,
                  navigation,
                  persistentData,
                  goBack,
                );
              }
            }}
            style={{ flex: 1 }}
          >
            {selectedSchools.length || selectedDepartments.length || selectedOthers.length
              ? 'Confirmer'
              : 'Passer'}
          </Button>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { schools, departments, location } = state;
  return {
    schoolsNear: schools.near,
    departments: departments.data,
    schoolsSearch: schools.search,
    departmentsSearch: departments.search,
    location,
    state: {
      schools: schools.state,
      departments: departments.state,
      location: location.state,
    },
  };
};

export default connect(mapStateToProps)(WelcomeLocation);
