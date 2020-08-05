import React from 'react';
import {
  View,
  Platform,
  Alert,
  FlatList,
  TextInput as RNTextInput,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  useTheme,
  Button,
  Divider,
  Searchbar,
  List,
  Checkbox,
  ProgressBar,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';

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
import { updateArticleParams } from '@redux/actions/contentData/articles';
import { updateSchools, searchSchools } from '@redux/actions/api/schools';
import { updateDepartments, searchDepartments } from '@redux/actions/api/departments';
import {
  TranslucentStatusBar,
  Illustration,
  CategoriesList,
  ErrorMessage,
  CollapsibleView,
  ChipAddList,
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
};

function done(
  selectedSchools: string[],
  selectedDepartments: string[],
  selectedOthers: string[],
  navigation: Navigation,
  persistentData: { title: string; key: string; departments?: Department[] }[],
  goBack: boolean,
) {
  console.log(persistentData);
  console.log(
    selectedSchools
      .map((s) => persistentData.find((p) => p.key === s)?.departments)
      .flat()
      .map((d: Department) => d?._id),
  );
  Promise.all([
    updateLocation({
      selected: true,
      schools: selectedSchools,
      departments: selectedDepartments,
      global: selectedOthers.includes('global'),
    }),
    updateArticleParams({
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
    }),
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

type DataType = 'school' | 'departement' | 'region' | 'other';

function getData(
  type: DataType,
  locationData: (School | SchoolPreload)[] | (Department | DepartmentPreload)[],
) {
  let data = [
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
            ? `, ${s?.departments[0].displayName || s?.departments[0].name || 'Inconnu'}`
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
  schools: (School | SchoolPreload)[];
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
};

const WelcomeLocation: React.FC<Props> = ({
  schools,
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

  const { goBack = false } = route.params || {};

  const [searchText, setSearchText] = React.useState('');
  const scrollRef = React.createRef<FlatList>();
  const inputRef = React.createRef<RNTextInput>();

  const [selectedSchools, setSelectedSchools] = React.useState(location.schools || []);
  const [selectedDepartments, setSelectedDepartments] = React.useState(location.departments || []);
  const [selectedOthers, setSelectedOthers] = React.useState(location.global ? ['global'] : []);

  useFocusEffect(
    React.useCallback(() => {
      // setImmediate(() => inputRef.current?.focus());
    }, [null]),
  );

  type CategoryType = 'schools' | 'departements' | 'regions' | 'other';
  const [category, setCategory] = React.useState<CategoryType>('schools');
  const [chipCategory, setChipCategory] = React.useState<CategoryType>(category);

  const searchChange = (text: string) => {
    if (text !== '') {
      searchSchools('initial', text);
      searchDepartments('initial', text);
    }
  };

  const retry = () => {
    if (searchText !== '') {
      searchSchools('initial', searchText);
      searchDepartments('initial', searchText);
    } else {
      updateSchools('initial');
      updateDepartments('initial');
    }
  };

  const next = () => {
    if (category === 'schools') {
      if (searchText) {
        searchSchools('next', searchText);
      } else {
        updateSchools('next');
      }
    } else if (category === 'departements' || category === 'regions') {
      if (searchText) {
        searchDepartments('next', searchText);
      } else {
        updateDepartments('next');
      }
    }
  };
  const data = {
    schools: {
      title: 'Écoles',
      key: 'schools',
      data: getData('school', searchText === '' ? schools : schoolsSearch),
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

  const [persistentData, setPersistentData] = React.useState<
    {
      key: string;
      title: string;
      type: 'school' | 'department' | 'other';
      departments?: Department[];
    }[]
  >([
    ...location.schoolData.map((s) => ({
      key: s._id,
      title: s.name,
      type: 'school',
      departments: s.departments,
    })),
    ...location.departmentData.map((d) => ({ key: d._id, title: d.name, type: 'department' })),
    { key: 'global', title: 'France entière', type: 'other' },
  ]);

  const renderItem = React.useCallback(
    ({ item }) => {
      let [selected, setSelected] = [
        [selectedSchools, setSelectedSchools],
        [selectedDepartments, setSelectedDepartments],
        [selectedOthers, setSelectedOthers],
      ][['school', 'department', 'other'].indexOf(item.type)];
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
              setPersistentData([
                ...persistentData,
                {
                  key: item.key,
                  title: item.title,
                  type: item.type,
                  departments: item.departments,
                },
              ]);
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
          <Illustration name="location-select" height={200} width={200} />
          <Text style={landingStyles.sectionTitle}>Choisissez votre école</Text>
        </View>
      </View>
      <View style={landingStyles.searchContainer}>
        <Searchbar
          ref={inputRef}
          placeholder="Rechercher"
          value={searchText}
          onChangeText={(props) => {
            setSearchText(props);
            searchChange(props);
          }}
        />
      </View>
      <CategoriesList
        selected={chipCategory}
        setSelected={(type: CategoryType) => {
          setChipCategory(type);
          setCategory(type);
        }}
        categories={Object.values(data).map((s) => ({ title: s.title, key: s.key }))}
      />
      {((searchText === '' &&
        (state.schools.list.loading.initial || state.departments.list.loading.initial)) ||
        (searchText !== '' &&
          (state.schools.search?.loading.initial ||
            state.departments.search?.loading.initial))) && <ProgressBar indeterminate />}
      {((searchText === '' && (state.schools.list.error || state.departments.list.error)) ||
        (searchText !== '' &&
          (state.schools.search?.error || state.departments.search?.error))) && (
        <ErrorMessage
          type="axios"
          error={
            searchText === ''
              ? [state.schools.list.error, state.departments.list.error]
              : [state.schools.search?.error, state.departments.search?.error]
          }
          retry={retry}
        />
      )}
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

  const ListEmptyComponent = (
    <View>
      {(searchText === '' &&
        (state.schools.list.loading.initial || state.departments.list.loading.initial)) ||
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

  let selected = [...selectedSchools, ...selectedDepartments, ...selectedOthers];

  return (
    <View style={styles.page}>
      <FlatList
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        ListHeaderComponent={ListHeaderComponent}
        data={data[category].data}
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
      <CollapsibleView collapsed={selected.length !== 0}>
        <View style={landingStyles.contentContainer}>
          <Text>
            Par défaut, vous verrez les articles déstinés à votre école, ainsi que les articles du
            département dans lequel se trouve l&apos;école et de la France entière
          </Text>
        </View>
      </CollapsibleView>

      <CollapsibleView collapsed={selected.length === 0}>
        <ChipAddList
          setList={(item) =>
            [setSelectedSchools, setSelectedDepartments, setSelectedOthers][
              ['school', 'department', 'other'].indexOf(item.type)
            ](
              [selectedSchools, selectedDepartments, selectedOthers][
                ['school', 'department', 'other'].indexOf(item.type)
              ]?.filter((i) => i !== item.key),
            )
          }
          data={selected.map((s) => persistentData.find((p) => p.key === s))}
          chipProps={{ icon: 'close', rightAction: true }}
        />
      </CollapsibleView>
      <View style={landingStyles.contentContainer}>
        <View style={landingStyles.buttonContainer}>
          <Button
            mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
            color={colors.primary}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {
              if (selected.length === 0) {
                logger.info('User has not specified a landing location. Showing alert.');
                Alert.alert(
                  'Ne pas spécifier de localisation?',
                  'Vous verrez uniquement les articles déstinés à la france entière',
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
            Confirmer
          </Button>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { schools, departments, location } = state;
  return {
    schools: schools.data,
    departments: departments.data,
    schoolsSearch: schools.search,
    departmentsSearch: departments.search,
    location,
    state: { schools: schools.state, departments: departments.state, location: location.state },
  };
};

export default connect(mapStateToProps)(WelcomeLocation);
