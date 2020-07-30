import React from 'react';
import {
  View,
  Platform,
  ScrollView,
  Dimensions,
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
import { updateSchools, searchSchools, fetchMultiSchool } from '@redux/actions/api/schools';
import {
  updateDepartments,
  searchDepartments,
  fetchMultiDepartment,
} from '@redux/actions/api/departments';
import { Illustration, CategoriesList, ChipAddList, ErrorMessage } from '@components/index';
import getStyles from '@styles/Styles';

import type { LandingStackParams } from '../index';
import getLandingStyles from '../styles/Styles';

// TODO: Externalize into @ts/redux
type ReduxLocation = {
  global: boolean;
  schools: string[];
  departments: string[];
};

function done(selected, schools, departments, navigation) {
  const schoolIds = schools.map((sch) => sch._id).filter((id) => selected.includes(id));
  const departmentIds = departments.map((dep) => dep._id).filter((id) => selected.includes(id));
  fetchMultiSchool(schoolIds);
  fetchMultiDepartment(departmentIds);
  updateArticleParams({
    schools: schoolIds,
    departments: departmentIds,
    global: selected.includes('global'),
  }).then(() => navigation.goBack());
}

function getData(type, locationData) {
  let data = [
    {
      key: 'global',
      title: 'France entière',
      description: "Pas de département ou d'école spécifique",
    },
  ];

  if (type === 'school') {
    data = locationData?.map((s) => {
      return {
        key: s._id,
        title: s.name,
        description: `${
          s?.address?.shortName || s?.address?.address?.city || 'Ville inconnue'
        }${s?.departments
          ?.filter((d) => d.type === 'departement')
          .map((d) => `, ${d.displayName}`)}`,
      };
    });
  } else if (type === 'departement' || type === 'region') {
    data = locationData
      ?.filter((d) => d.type === type)
      ?.map((d) => {
        return {
          key: d._id,
          title: d.name,
          description: `${type === 'departement' ? 'Département' : 'Région'} ${d.code || ''}`,
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
  articleParams: ReduxLocation;
  navigation: StackNavigationProp<LandingStackParams, 'SelectLocation'>;
};

const ArticleEditParams: React.FC<Props> = ({
  route,
  schools,
  departments,
  schoolsSearch,
  departmentsSearch,
  state,
  articleParams,
  navigation,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getLandingStyles(theme);
  const styles = getStyles(theme);

  const [searchText, setSearchText] = React.useState('');
  const scrollRef = React.createRef<FlatList>();
  const inputRef = React.createRef<RNTextInput>();

  const [selected, setSelected] = React.useState([
    ...articleParams.schools,
    ...articleParams.departments,
    ...(articleParams.global ? ['global'] : []),
  ]);

  useFocusEffect(
    React.useCallback(() => {
      // setImmediate(() => inputRef.current?.focus());
    }, [null]),
  );

  const [category, setCategory]: [
    'schools' | 'departements' | 'regions' | 'other',
    any,
  ] = React.useState(route.params.type);

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
        {category !== 'other' && (
          <View style={articleStyles.searchContainer}>
            <Searchbar
              ref={inputRef}
              placeholder="Rechercher"
              value={searchText}
              onChangeText={searchChange}
            />
          </View>
        )}
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
    [searchText],
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
      <View style={[articleStyles.buttonContainer]}>
        <Button
          mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
          color={colors.primary}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => done(selected, schools, departments, navigation)}
        >
          Confirmer
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { schools, departments, articleData } = state;
  return {
    schools: schools.data,
    departments: departments.data,
    schoolsSearch: schools.search,
    departmentsSearch: departments.search,
    articleParams: articleData.params,
    state: { schools: schools.state, departments: departments.state },
  };
};

export default connect(mapStateToProps)(ArticleEditParams);
