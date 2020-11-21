import { StackNavigationProp } from '@react-navigation/stack';
import * as Permissions from 'expo-permissions';
import React from 'react';
import {
  View,
  Platform,
  Alert,
  FlatList,
  TextInput as RNTextInput,
  ActivityIndicator,
} from 'react-native';
import Location from 'react-native-geolocation-service';
import { Text, Button, Divider, List, Checkbox, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  TranslucentStatusBar,
  Illustration,
  CategoriesList,
  ErrorMessage,
  CollapsibleView,
  ChipAddList,
  Searchbar,
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
  ReduxLocation as OldReduxLocation,
  Account,
} from '@ts/types';
import { useTheme, logger } from '@utils/index';

import type { LandingStackParams } from '../index';
import getLandingStyles from '../styles/Styles';

type Navigation = StackNavigationProp<LandingStackParams, 'SelectLocation'>;

type ReduxLocation = OldReduxLocation & {
  schoolData: SchoolPreload[];
  departmentData: DepartmentPreload[];
};

type PersistantData = {
  key: string;
  title: string;
  description?: string;
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
  const schools = selectedSchools.filter((s) => !!s);
  const departments = selectedDepartments.filter((s) => !!s);
  const params = {
    schools: schools.filter((s) => !!s),
    departments: [
      ...departments,
      // Todo: logic to select extra departments
      ...schools
        .map((s) => persistentData.find((p) => p.key === s)?.departments)
        .flat()
        .map((d?: DepartmentPreload) => d?._id || ''),
    ].filter((d) => !!d),
    global: true,
  };
  Promise.all([
    updateLocation({
      selected: true,
      schools,
      departments,
      global: selectedOthers.includes('global') || (!schools.length && !departments.length),
    }),
    updateArticleParams(params),
    updateEventParams(params),
    ...schools.map((s) =>
      addArticleQuick('school', s, persistentData.find((p) => p.key === s)?.title || 'École'),
    ),
    ...schools.map((s) =>
      addEventQuick('school', s, persistentData.find((p) => p.key === s)?.title || 'École'),
    ),
    ...departments.map((d) =>
      addArticleQuick(
        'departement',
        d,
        persistentData.find((p) => p.key === d)?.title || 'Département',
      ),
    ),
    ...departments.map((d) =>
      addEventQuick(
        'departement',
        d,
        persistentData.find((p) => p.key === d)?.title || 'Département',
      ),
    ),
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
            ? `, ${s.departments[0]?.displayName || s.departments[0]?.name || 'Inconnu'}`
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

type WelcomeLocationProps = {
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
  account: Account;
};

const WelcomeLocation: React.FC<WelcomeLocationProps> = ({
  schoolsNear,
  departments,
  schoolsSearch,
  departmentsSearch,
  state,
  account,
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
  const [locationError, setLocationError] = React.useState(false);

  if (Platform.OS === 'web' && !account.loggedIn) {
    window.location.replace('https://beta.topicapp.fr');
  }

  React.useEffect(() => {
    updateDepartments('initial');
    // Check if Location is requestable
    // If it is, then show the FAB to go to location
    Permissions.getAsync(Permissions.LOCATION)
      .then(async ({ status, canAskAgain }) => {
        console.log(`Status ${status} & canAskAgain ${canAskAgain}`);
        // User previously granted permission
        if (status === Permissions.PermissionStatus.GRANTED) {
          logger.verbose('Location previously granted, showing location FAB');
          setUserLocation(true);
          Location.getCurrentPosition(
            (info) => updateNearSchools('initial', info?.coords?.latitude, info?.coords?.longitude),
            (err) => {
              logger.warn(`Location err ${err}`);
              setLocationError(true);
            },
          );
        } else if (canAskAgain) {
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
      setButtonVisible(false);
      setUserLocation(true);
      Location.getCurrentPosition(
        (info) => updateNearSchools('initial', info?.coords?.latitude, info?.coords?.longitude),
        (err) => {
          logger.warn(`Location err ${err}`);
          setLocationError(true);
        },
      );
      // updateNearSchools('initial', coords.latitude, coords.longitude);
    } else {
      if (!canAskAgain) {
        setButtonVisible(false);
        logger.info('Location permission request prompt denied, hiding location FAB.');
      }
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
        Location.getCurrentPosition(
          (info) => updateNearSchools('initial', info?.coords?.latitude, info?.coords?.longitude),
          (err) => {
            logger.warn(`Location err ${err}`);
            setLocationError(true);
          },
        );
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
            <View style={!!searchText && { marginTop: 30 }}>
              <Text style={landingStyles.sectionTitle}>Choisissez votre école</Text>
            </View>
          </CollapsibleView>
        </View>
      </View>
      <View style={[landingStyles.searchContainer, { marginTop: searchText ? 20 : 0 }]}>
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
          strings={{
            what: 'La récupération des localisations',
            contentSingular: 'La liste de localisations',
            contentPlural: 'Les localisations',
          }}
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
        {state.schools.near.loading.initial ? null : (
          <View style={[styles.centerIllustrationContainer, styles.container, { marginTop: 50 }]}>
            {!userLocation && (
              <Text style={{ maxWidth: 300, alignSelf: 'center' }}>Recherchez votre école</Text>
            )}
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
                  <Text>ou appuyez ci-dessous pour trouver les écoles autour de vous</Text>
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
  const { schools, departments, location, account } = state;
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
    account,
  };
};

export default connect(mapStateToProps)(WelcomeLocation);
