import React from 'react';
import {
  View,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  TextInput as RNTextInput,
} from 'react-native';
import { Text, useTheme, Button, Divider, Searchbar } from 'react-native-paper';
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
import { CustomTabView, Illustration } from '@components/index';
import getStyles from '@styles/Styles';

import type { LandingStackParams } from '../index';
import getLandingStyles from '../styles/Styles';
import ItemList from '../components/ItemList';

// TODO: Externalize into @ts/redux
type ReduxLocation = {
  global: boolean;
  schools: string[];
  departments: string[];
};

function done(selected, schools, departments, navigation) {
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
          ?.filter((d) => d.type === 'department')
          .map((d) => `, ${d.displayName}`)}`,
      };
    });
  } else if (type === 'department' || type === 'region') {
    data = locationData
      ?.filter((d) => d.type === type)
      ?.map((d) => {
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
  navigation: StackNavigationProp<LandingStackParams, 'SelectLocation'>;
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
  const scrollRef = React.createRef<ScrollView>();
  const inputRef = React.createRef<RNTextInput>();

  // Note: when selected is changed, the component is not rerendered.
  // This is essential because we do not want to rerender four lists
  // every time the user presses a checkbox
  const selected = [...location.schools, ...location.departments];
  if (location.global) selected.push('global');

  const setSelected = (method: 'add' | 'remove', item: string) => {
    if (method === 'remove') {
      selected.splice(selected.indexOf(item), 1);
    } else {
      selected.push(item);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setImmediate(() => inputRef.current?.focus());
    }, [null]),
  );

  const schoolData = getData('school', searchText === '' ? schools : schoolsSearch);
  const departmentData = getData('department', searchText === '' ? departments : departmentsSearch);
  const regionData = getData('region', departments);
  const otherData = getData('other', []);

  const scrollHeight = 190;

  const searchChange = (text: string) => {
    scrollRef.current?.scrollTo({ y: scrollHeight, animated: true });
    if (text !== searchText && text !== '') {
      searchSchools('initial', text);
      searchDepartments('initial', text);
    }
    setSearchText(text);
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

  const next = (type: 'schools' | 'departments' | 'regions') => {
    if (type === 'schools') {
      if (searchText !== '') {
        searchSchools('next', searchText);
      } else {
        updateSchools('next');
      }
    } else if (searchText !== '') {
      searchDepartments('next', searchText);
    } else {
      updateDepartments('next');
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled">
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
        <CustomTabView
          keyboardDismissMode="none"
          scrollEnabled={false}
          pages={[
            {
              key: 'school',
              title: 'École',
              component: (
                <View style={{ height: Dimensions.get('window').height }}>
                  <ItemList
                    type="school"
                    initialSelected={selected}
                    data={schoolData}
                    setGlobalSelected={setSelected}
                    state={state}
                    retry={retry}
                    next={() => next('schools')}
                  />
                </View>
              ),
            },
            {
              key: 'department',
              title: 'Département',
              component: (
                <ItemList
                  type="department"
                  initialSelected={selected}
                  data={departmentData}
                  setGlobalSelected={setSelected}
                  state={state}
                  retry={retry}
                  next={() => next('departments')}
                />
              ),
            },
            {
              key: 'region',
              title: 'Région',
              component: (
                <ItemList
                  type="region"
                  initialSelected={selected}
                  data={regionData}
                  setGlobalSelected={setSelected}
                  state={state}
                  retry={retry}
                  next={() => next('regions')}
                />
              ),
            },
            {
              key: 'france',
              title: 'Autre',
              component: (
                <ItemList
                  type="other"
                  initialSelected={selected}
                  data={otherData}
                  setGlobalSelected={setSelected}
                  state={state}
                  retry={retry}
                  next={() => console.log('next')}
                />
              ),
            },
          ]}
        />
      </ScrollView>
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
