import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, ScrollView, Dimensions } from 'react-native';
import { Text, useTheme, Button, Divider, Searchbar, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import getStyles from '@styles/Styles';
import CustomTabView from '@components/CustomTabView';
import ErrorMessage from '@components/ErrorMessage';
import { updateLocation, fetchLocationData } from '@redux/actions/data/location';
import { updateSchools, searchSchools } from '@redux/actions/api/schools';
import { updateDepartments, searchDepartments } from '@redux/actions/api/departments';
import IllustrationSelectLocationLight from '@assets/images/illustrations/select_location/select_location_light.svg';
import IllustrationSelectLocationDark from '@assets/images/illustrations/select_location/select_location_dark.svg';

import getLandingStyles from '../styles/Styles';

// import { SchoolsTab } from './SchoolsTab';
import ItemList from '../components/ItemList';

function done(selected, schools, departments, navigation) {
  updateLocation({
    selected: true,
    schools: schools.map((sch) => sch._id).filter((id) => selected.includes(id)),
    departments: departments.map((dep) => dep._id).filter((id) => selected.includes(id)),
    global: selected.includes('global'),
  });
  navigation.navigate('Main', {
    screen: 'Home1',
    params: { screen: 'Home2', params: { screen: 'Article' } },
  });
}

function getData(type, locationData) {
  let data = [
    {
      type: 'global',
      title: 'France entière',
      description: "Pas de département ou d'école spécifique",
      _id: 'global',
    },
  ];

  if (type === 'school') {
    data = locationData?.map((s) => {
      return {
        type: 'school',
        title: s.name,
        description: `${
          s?.address?.shortName || s?.address?.address?.city || 'Ville inconnue'
        }${s?.departments
          ?.filter((d) => d.type === 'department')
          .map((d) => `, ${d.displayName}`)}`,
        _id: s._id,
      };
    });
  } else if (type === 'department' || type === 'region') {
    data = locationData
      ?.filter((d) => d.type === type)
      ?.map((d) => {
        return {
          type,
          title: d.name,
          description: `${type === 'department' ? 'Département' : 'Région'} ${d.code || ''}`,
          _id: d._id,
        };
      });
  }
  return data;
}

updateSchools('initial');
updateDepartments('initial');

function WelcomeLocation({
  schools,
  departments,
  schoolsSearch,
  departmentsSearch,
  state,
  navigation,
}) {
  const [search, setSearch] = React.useState('');
  const theme = useTheme();
  const { colors } = theme;
  const landingStyles = getLandingStyles(theme);
  const styles = getStyles(theme);

  const scrollRef = React.createRef();
  const inputRef = React.createRef();

  // Note: when selected is changed, the component is not rerendered.
  // This is essential because we do not want to rerender four lists
  // every time the user presses a checkbox
  const selected = [];
  const setSelected = (method, x) => {
    if (method === 'remove') {
      selected.splice(selected.indexOf(x), 1);
    } else {
      selected.push(x);
    }
  };

  const schoolData = getData('school', search === '' ? schools : schoolsSearch);
  const departmentData = getData('department', search === '' ? departments : departmentsSearch);
  const regionData = getData('region', departments);
  const otherData = getData('other', []);

  const scrollHeight = 190;

  const searchChange = (text) => {
    scrollRef.current.scrollTo({ y: scrollHeight, animated: true });
    setSearch(text);
    if (text !== search && text !== '') {
      searchSchools('initial', text);
      searchDepartments('initial', text);
    }
  };

  const retry = () => {
    if (search !== '') {
      searchSchools('initial', search);
      searchDepartments('initial', search);
    } else {
      updateSchools('initial');
      updateDepartments('initial');
    }
  };

  const next = (type) => {
    if (type === 'schools') {
      if (search !== '') {
        searchSchools('next', search);
      } else {
        updateSchools('next');
      }
    } else if (search !== '') {
      searchDepartments('next', search);
    } else {
      updateDepartments('next');
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView ref={scrollRef}>
        <View style={landingStyles.headerContainer}>
          <View style={landingStyles.centerIllustrationContainer}>
            {theme.dark ? (
              <IllustrationSelectLocationDark height={200} width={200} />
            ) : (
              <IllustrationSelectLocationLight height={200} width={200} />
            )}
            <Text style={landingStyles.sectionTitle}>Choisissez votre école</Text>
          </View>
        </View>
        <View style={landingStyles.searchContainer}>
          <Searchbar
            placeholder="Rechercher"
            value={search}
            onChangeText={searchChange}
            ref={inputRef}
          />
        </View>
        <CustomTabView
          scrollEnabled={false}
          pages={[
            {
              key: 'school',
              title: 'École',
              component: (
                <View style={{ height: Dimensions.get('window').height }}>
                  <ItemList
                    type="school"
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
      {/* <View style={landingStyles.contentContainer}>
        <Text>
          Par défaut, vous verrez les articles de votre école, ainsi que les articles du département
          dans lequel se trouve l&apos;école et de la France entière
        </Text>
      </View> */}
      <View style={landingStyles.contentContainer}>
        <View style={landingStyles.buttonContainer}>
          <Button
            mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
            color={colors.primary}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => done(selected, schools, departments, navigation)}
            style={{ flex: 1 }}
          >
            Confirmer
          </Button>
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { schools, departments } = state;
  console.log(`d ${schools?.data?.length} s ${schools?.search.length}`);
  return {
    schools: schools.data,
    departments: departments.data,
    schoolsSearch: schools.search,
    departmentsSearch: departments.search,
    state: { schools: schools.state, departments: departments.state },
  };
};

export default connect(mapStateToProps)(WelcomeLocation);

WelcomeLocation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  schools: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  departments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  schoolsSearch: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  departmentsSearch: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  state: PropTypes.shape({
    schools: PropTypes.shape({
      list: PropTypes.shape({
        loading: PropTypes.shape({
          initial: PropTypes.bool.isRequired,
          refresh: PropTypes.bool.isRequired,
        }),
        error: PropTypes.object, // TODO: Better PropTypes
      }).isRequired,
    }),
    departments: PropTypes.shape({
      list: PropTypes.shape({
        loading: PropTypes.shape({
          initial: PropTypes.bool.isRequired,
          refresh: PropTypes.bool.isRequired,
        }),
        error: PropTypes.object, // TODO: Better PropTypes
      }).isRequired,
    }),
  }).isRequired,
};
