import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { View, Platform, ScrollView } from 'react-native';
import { Text, useTheme, Button, Divider, Searchbar, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import getStyles from '@styles/Styles';
import CustomTabView from '@components/CustomTabView';
import ErrorMessage from '@components/ErrorMessage';
import { updateSchools } from '@redux/actions/api/schools';
import { updateDepartments } from '@redux/actions/api/departments';

import getLandingStyles from '../styles/Styles';

// import { SchoolsTab } from './SchoolsTab';
import ItemList from './ItemList';

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
    data = locationData.map((s) => {
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
      .filter((d) => d.type === type)
      .map((d) => {
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

function WelcomeLocation({ schools, departments, state, navigation, done }) {
  const theme = useTheme();
  const { colors } = theme;
  const landingStyles = getLandingStyles(theme);
  const styles = getStyles(theme);

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
    console.log('global selected changed!', selected);
  };

  const schoolData = getData('school', schools);
  const departmentData = getData('department', departments);
  const regionData = getData('region', departments);
  const otherData = getData('other', []);

  return (
    <View style={styles.page}>
      <ScrollView>
        <View style={landingStyles.headerContainer}>
          <View style={landingStyles.centerContainer}>
            <Icon size={50} color={colors.primay} name="map-marker" />
            <Text style={landingStyles.sectionTitle}>Choisissez votre école</Text>
          </View>
        </View>
        <View style={landingStyles.searchContainer}>
          <Searchbar placeholder="Rechercher" />
        </View>
        <CustomTabView
          pages={[
            {
              key: 'school',
              title: 'École',
              component: (
                <ItemList
                  type="school"
                  data={schoolData}
                  setGlobalSelected={setSelected}
                  state={state}
                />
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
                />
              ),
            },
          ]}
        />
      </ScrollView>
      <Divider />
      <View style={landingStyles.contentContainer}>
        <Text>
          Par défaut, vous verrez les articles de votre école, ainsi que les articles du département
          dans lequel se trouve l&apos;école et de la France entière
        </Text>
      </View>
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
  return {
    schools: schools.data,
    departments: departments.data,
    state: { schools: schools.state, departments: departments.state },
  };
};

export default connect(mapStateToProps)(WelcomeLocation);

WelcomeLocation.propTypes = {
  done: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  schools: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  departments: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  state: PropTypes.shape({
    schools: PropTypes.shape({
      list: PropTypes.shape({
        loading: PropTypes.shape({
          initial: PropTypes.bool.isRequired,
          refresh: PropTypes.bool.isRequired,
        }),
        error: PropTypes.oneOf([PropTypes.object, null]).isRequired, // TODO: Better PropTypes
      }).isRequired,
    }),
    departments: PropTypes.shape({
      list: PropTypes.shape({
        loading: PropTypes.shape({
          initial: PropTypes.bool.isRequired,
          refresh: PropTypes.bool.isRequired,
        }),
        error: PropTypes.oneOf([PropTypes.object, null]).isRequired, // TODO: Better PropTypes
      }).isRequired,
    }),
  }).isRequired,
};
