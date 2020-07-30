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
} from '@ts/types';
import { logger } from '@utils/index';
import { updateLocation } from '@redux/actions/data/location';
import { updateArticleParams } from '@redux/actions/contentData/articles';
import { updateSchools, searchSchools } from '@redux/actions/api/schools';
import { updateDepartments, searchDepartments } from '@redux/actions/api/departments';
import { Illustration, CategoriesList, ErrorMessage } from '@components/index';
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
  selected: string[],
  schools: (School | SchoolPreload)[],
  departments: (Department | DepartmentPreload)[],
  navigation: Navigation,
) {
  const schoolIds = schools.map((sch) => sch._id).filter((id) => selected.includes(id));
  const departmentIds = departments.map((dep) => dep._id).filter((id) => selected.includes(id));
  Promise.all([
    updateLocation({
      selected: true,
      schools: schoolIds,
      departments: departmentIds,
      global: selected.includes('global') || selected.length === 0,
    }),
    updateArticleParams({
      schools: schoolIds,
      departments: [
        ...departmentIds,
        ...schools
          .filter((s) => selected.includes(s._id))
          .map((s) => s.deparments || [])
          .flat(),
      ],
      global: true,
    }),
  ]).then(() =>
    navigation.navigate('Root', {
      screen: 'Main',
      params: {
        screen: 'Home1',
        params: { screen: 'Home2', params: { screen: 'Article' } },
      },
    }),
  );
}

type DataType = 'school' | 'department' | 'region' | 'other';

function getData(
  type: DataType,
  locationData: (School | SchoolPreload)[] | (Department | DepartmentPreload)[],
) {
  let data = [
    {
      key: 'global',
      title: 'France entière',
      description: "Pas de département ou d'école spécifique",
    },
  ];

  if (type === 'school') {
    data = (locationData as School[])?.map((s) => {
      return {
        key: s._id,
        title: s.name,
        description: `${
          s?.address?.shortName || s?.address?.address?.city || 'Ville inconnue'
        }${s?.departments
          ?.filter((d) => d.type === 'department')
          .map((d) => `, ${d.displayName}`)}`,
      };
    });
  } else if (type === 'department' || type === 'region') {
    data = (locationData as Department[])
      // TODO: Change to Region | Department in the future
      ?.filter((d) => d.type === type)
      ?.map((d: Department) => {
        return {
          key: d._id,
          title: d.name,
          description: `${type === 'department' ? 'Département' : 'Région'} ${d.code || ''}`,
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
  },
  navigation,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const landingStyles = getLandingStyles(theme);
  const styles = getStyles(theme);

  const [searchText, setSearchText] = React.useState('');
  const scrollRef = React.createRef<FlatList>();
  const inputRef = React.createRef<RNTextInput>();

  const [selected, setSelected] = React.useState([...location.schools, ...location.departments]);
  if (location.global) selected.push('global');

  useFocusEffect(
    React.useCallback(() => {
      // setImmediate(() => inputRef.current?.focus());
    }, [null]),
  );

  type CategoryType = 'schools' | 'departements' | 'regions' | 'other';
  const [category, setCategory] = React.useState<CategoryType>('schools');
  const [chipCategory, setChipCategory] = React.useState<CategoryType>(category);

  const searchChange = (text: string) => {
    setSearchText(text);
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
      console.log('Hello');
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
      data: getData('department', searchText === '' ? departments : departmentsSearch),
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

  const renderItem = React.useCallback(
    ({ item }) => (
      <List.Item
        title={item.title}
        description={item.description}
        descriptionNumberOfLines={1}
        onPress={() => {
          if (selected.includes(item.key)) {
            setSelected(selected.filter((s) => s !== item.key));
          } else {
            setSelected([...selected, item.key]);
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
    ),
    [selected],
  );

  const ListHeaderComponent = React.useCallback(
    () => (
      <View>
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
            onChangeText={searchChange}
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
    ),
    [chipCategory, searchText],
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

  const ListEmptyComponent = React.useCallback(
    () =>
      (searchText === '' &&
        (state.schools.list.loading.initial || state.departments.list.loading.initial)) ||
      (searchText !== '' &&
        (state.schools.search?.loading.initial ||
          state.departments.search?.loading.initial)) ? null : (
        <View style={styles.centerIllustrationContainer}>
          <Text>Aucun résultat</Text>
        </View>
      ),
    [],
  );

  const ListFooterComponent = React.useCallback(
    () => (
      <View style={{ minHeight: 50 }}>
        {((searchText === '' &&
          (state.schools.list.loading.next || state.departments.list.loading.next)) ||
          (searchText !== '' &&
            (state.schools.search?.loading.next || state.departments.search?.loading.next))) && (
          <ActivityIndicator size="large" color={colors.primary} />
        )}
      </View>
    ),
    [],
  );

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
      <View style={landingStyles.contentContainer}>
        <Text>
          Par défaut, vous verrez les articles déstinés à votre école, ainsi que les articles du
          département dans lequel se trouve l&apos;école et de la France entière
        </Text>
      </View>
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
                      onPress: () => done(selected, schools, departments, navigation),
                    },
                  ],
                  { cancelable: true },
                );
              } else {
                logger.info('User selected locations', selected);
                done(selected, schools, departments, navigation);
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
    state: { schools: schools.state, departments: departments.state },
  };
};

export default connect(mapStateToProps)(WelcomeLocation);
