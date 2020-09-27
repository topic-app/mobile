import React from 'react';
import {
  View,
  Platform,
  FlatList,
  TextInput as RNTextInput,
  ActivityIndicator,
} from 'react-native';
import { Text, useTheme, Button, Divider, List, Checkbox, ProgressBar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from 'react-native-screens/native-stack';
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
import { updateArticleParams } from '@redux/actions/contentData/articles';
import { updateSchools, searchSchools, fetchMultiSchool } from '@redux/actions/api/schools';
import {
  fetchMultiDepartment,
  updateDepartments,
  searchDepartments,
} from '@redux/actions/api/departments';
import { ErrorMessage, CollapsibleView, ChipAddList, Searchbar } from '@components/index';
import getStyles from '@styles/Styles';

import getLandingStyles from '../styles/Styles';

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
  type: 'schools' | 'departements' | 'regions' | 'other',
  initialData: ReduxLocation,
  callback: (location: ReduxLocation) => any,
) {
  callback({
    schools: type === 'schools' ? selectedSchools : initialData.schools,
    departments:
      type === 'departements' || type === 'regions' ? selectedDepartments : initialData.departments,
    global: type === 'other' ? selectedOthers.includes('global') : initialData.global,
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
          s?.departments?.length
            ? `, ${s.departments[0].displayName || s.departments[0].name || 'Inconnu'}`
            : ''
        }`,
        type: 'school',
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
  };
  initialData?: ReduxLocation;
  type: 'schools' | 'departements' | 'regions' | 'other';
  hideSearch?: boolean;
  callback: (location: ReduxLocation) => any;
};

const WelcomeLocation: React.FC<Props> = ({
  schools,
  departments,
  schoolsSearch,
  departmentsSearch,
  state,
  initialData = {
    global: false,
    schools: [],
    departments: [],
  },
  type,
  hideSearch,
  callback,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const landingStyles = getLandingStyles(theme);
  const styles = getStyles(theme);

  console.log(JSON.stringify(initialData));

  const [searchText, setSearchText] = React.useState('');
  const scrollRef = React.createRef<FlatList>();
  const inputRef = React.createRef<RNTextInput>();

  const [selectedSchools, setSelectedSchools] = React.useState(initialData.schools || []);
  const [selectedDepartments, setSelectedDepartments] = React.useState(
    initialData.departments || [],
  );
  const [selectedOthers, setSelectedOthers] = React.useState(initialData.global ? ['global'] : []);

  useFocusEffect(
    React.useCallback(() => {
      // setImmediate(() => inputRef.current?.focus());
    }, [null]),
  );

  const searchChange = (text: string) => {
    if (text !== '') {
      if (type === 'schools') {
        searchSchools('initial', text);
      } else if (type === 'departements' || type === 'regions') {
        searchDepartments('initial', text);
      }
    }
  };

  const retry = () => {
    if (searchText !== '') {
      if (type === 'schools') {
        searchSchools('initial', searchText);
      } else if (type === 'departements' || type === 'regions') {
        searchDepartments('initial', searchText);
      }
    } else {
      if (type === 'schools') {
        updateSchools('initial');
      } else if (type === 'departements' || type === 'regions') {
        updateDepartments('initial');
      }
    }
  };

  const next = () => {
    if (type === 'schools') {
      if (searchText) {
        searchSchools('next', searchText);
      } else {
        updateSchools('next');
      }
    } else if (type === 'departements' || type === 'regions') {
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
      <View style={landingStyles.searchContainer}>
        {!hideSearch && (
          <Searchbar
            ref={inputRef}
            placeholder="Rechercher"
            value={searchText}
            onChangeText={setSearchText}
            onIdle={searchChange}
          />
        )}
      </View>
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

  return (
    <View style={styles.page}>
      <FlatList
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        ListHeaderComponent={ListHeaderComponent}
        data={data[type].data}
        getItemLayout={getItemLayout}
        onEndReached={next}
        onEndReachedThreshold={1}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        renderItem={renderItem}
      />
      <Divider />
      <View style={landingStyles.contentContainer}>
        <View style={landingStyles.buttonContainer}>
          <Button
            mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
            color={colors.primary}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {
              done(
                selectedSchools,
                selectedDepartments,
                selectedOthers,
                type,
                initialData,
                callback,
              );
            }}
          >
            Confirmer
          </Button>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { articleData, schools, departments } = state;
  return {
    schools: schools.data,
    departments: departments.data,
    schoolsSearch: schools.search,
    departmentsSearch: departments.search,
    state: { schools: schools.state, departments: departments.state },
  };
};

export default connect(mapStateToProps)(WelcomeLocation);
