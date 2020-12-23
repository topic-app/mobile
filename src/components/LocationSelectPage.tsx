import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { View, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Text, Button, Divider, List, Checkbox, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  updateDepartments,
  searchDepartments,
  fetchMultiDepartment,
} from '@redux/actions/api/departments';
import { updateSchools, searchSchools, fetchMultiSchool } from '@redux/actions/api/schools';
import getStyles from '@styles/Styles';
import {
  School,
  SchoolPreload,
  Department,
  DepartmentPreload,
  SchoolRequestState,
  DepartmentRequestState,
  State,
  ReduxLocation,
} from '@ts/types';
import { useTheme } from '@utils/index';

import { ChipAddList } from './ChipLists';
import CollapsibleView from './CollapsibleView';
import ErrorMessage from './ErrorMessage';
import { CustomHeaderBar, CustomHeaderBarProps } from './Header';
import Searchbar from './Searchbar';
import getLocationStyles from './styles/LocationSelectPageStyles';

function done(
  selectedSchools: string[],
  selectedDepartments: string[],
  selectedOthers: string[],
  type: 'schools' | 'departements' | 'regions' | 'other',
  initialData: Partial<ReduxLocation>,
  callback: (location: ReduxLocation) => any,
) {
  callback({
    schools:
      (type === 'schools' ? selectedSchools : initialData.schools) || initialData.schools || [],
    departments:
      (type === 'departements' || type === 'regions'
        ? selectedDepartments
        : initialData.departments) ||
      initialData.departments ||
      [],
    global:
      (type === 'other' ? selectedOthers.includes('global') : initialData.global) ||
      initialData.global ||
      false,
  });
}

type DataType = 'school' | 'departement' | 'region' | 'other';

type LocationItem = {
  key: string;
  title: string;
  description: string;
  type: DataType;
};

function getData(
  type: DataType,
  locationData: (School | SchoolPreload)[] | (Department | DepartmentPreload)[],
) {
  let data: LocationItem[] = [
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
          s?.departments?.length ? `, ${s.departments[0].displayName || 'Inconnu'}` : ''
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
          type: 'departement',
        };
      });
  }
  return data;
}

type LocationSelectProps = {
  schools: (School | SchoolPreload)[];
  departments: (Department | DepartmentPreload)[];
  schoolsSearch: SchoolPreload[];
  departmentsSearch: DepartmentPreload[];
  schoolItems: School[];
  departmentItems: Department[];
  state: {
    schools: SchoolRequestState;
    departments: DepartmentRequestState;
  };
  initialData?: Partial<ReduxLocation>;
  type: 'schools' | 'departements' | 'regions' | 'other';
  hideSearch?: boolean;
  callback: (location: ReduxLocation) => any;
  headerOptions?: Partial<CustomHeaderBarProps['scene']['descriptor']['options']>;
};

const LocationSelect: React.FC<LocationSelectProps> = ({
  schools,
  departments,
  schoolsSearch,
  departmentsSearch,
  schoolItems,
  departmentItems,
  state,
  initialData = {
    global: false,
    schools: [],
    departments: [],
  },
  type,
  hideSearch,
  callback,
  headerOptions = {},
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const locationStyles = getLocationStyles(theme);
  const styles = getStyles(theme);

  const [searchText, setSearchText] = React.useState('');
  const scrollRef = React.createRef<FlatList>();
  const searchbarRef = React.createRef<Searchbar>();

  const [selectedSchools, setSelectedSchools] = React.useState(initialData.schools || []);
  const [selectedDepartments, setSelectedDepartments] = React.useState(
    initialData.departments || [],
  );
  const [selectedOthers, setSelectedOthers] = React.useState(initialData.global ? ['global'] : []);

  let selectedLocations: {
    type: 'school' | 'department' | 'other';
    id: string;
    name: string;
  }[] = [];

  if (type === 'schools') {
    selectedLocations = selectedSchools
      .map((schId) => schoolItems.find((sch) => sch._id === schId))
      .filter((sch) => sch !== undefined)
      .map((s) => ({ type: 'school', id: s!._id, name: s!.name }));
  }

  if (type === 'departements' || type === 'regions') {
    selectedLocations = selectedDepartments
      .map((depId) => departmentItems.find((dep) => dep._id === depId))
      .filter((dep) => {
        if (type === 'departements') {
          return dep?.type === 'departement';
        } else {
          return dep?.type === 'region';
        }
      })
      .map((d) => ({ type: 'department', id: d!._id, name: d!.name }));
  }

  useFocusEffect(
    React.useCallback(() => {
      if (type === 'schools' && initialData.schools) {
        fetchMultiSchool(initialData.schools);
      }
      if (type === 'departements' || type === 'regions') {
        if (initialData.departments) {
          fetchMultiDepartment(initialData.departments);
        }
        updateDepartments('initial');
      }
    }, [null]),
  );

  const removeLocation = (key: string) => {
    setSelectedSchools(selectedSchools.filter((s) => s !== key));
    setSelectedDepartments(selectedDepartments.filter((s) => s !== key));
    setSelectedOthers(selectedOthers.filter((s) => s !== key));
  };

  const onSearchChange = (text: string) => {
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
      } // setImmediate(() => searchbarRef.current?.focus());
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

  const data: {
    [key in 'schools' | 'departements' | 'regions' | 'other']: {
      title: string;
      key: string;
      data: LocationItem[];
    };
  } = {
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

  type renderItemProps = {
    item: LocationItem;
  };

  const renderItem = React.useCallback(
    ({ item }: renderItemProps) => {
      const [selected, setSelected] = {
        school: [selectedSchools, setSelectedSchools] as const,
        departement: [selectedDepartments, setSelectedDepartments] as const,
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
              if (item.type === 'school') {
                fetchMultiSchool([item.key]);
              } else if (item.type === 'departement' || item.type === 'region') {
                fetchMultiDepartment([item.key]);
              }
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
      <View style={locationStyles.searchContainer}>
        {!hideSearch && (
          <Searchbar
            ref={searchbarRef}
            placeholder="Rechercher"
            value={searchText}
            onChangeText={setSearchText}
            onIdle={onSearchChange}
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
          strings={{
            what: 'La récupération des localisations',
            contentPlural: 'Les localisations',
          }}
        />
      )}
    </View>
  );

  const ITEM_HEIGHT = 68.5714;

  const getItemLayout = React.useCallback(
    (_data, index) => ({
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
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Localisation',
              ...headerOptions,
            },
          },
        }}
      />
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
      <View>
        <CollapsibleView collapsed={selectedLocations.length === 0}>
          <ChipAddList
            setList={({ key }) => removeLocation(key)}
            data={selectedLocations.map((loc) => ({ title: loc.name, key: loc.id, ...loc }))}
            chipProps={{ icon: 'close', rightAction: true }}
            style={{ marginBottom: 0 }}
          />
        </CollapsibleView>
        <View style={locationStyles.buttonContainer}>
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
  const { schools, departments } = state;
  return {
    schools: schools.data,
    departments: departments.data,
    schoolItems: schools.items,
    departmentItems: departments.items,
    schoolsSearch: schools.search,
    departmentsSearch: departments.search,
    state: { schools: schools.state, departments: departments.state },
  };
};

export default connect(mapStateToProps)(LocationSelect);
