import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, Text, Divider, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { ErrorMessage, InlineCard, Illustration } from '@components/index';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import getStyles from '@styles/Styles';

function ArticleParams({ navigation, params, schools, departments, state }) {
  const theme = useTheme();
  const styles = getStyles(theme);

  console.log(params);

  const fetch = () => {
    if (params.schools) {
      fetchMultiSchool(params.schools);
    }
    if (params.departments) {
      fetchMultiDepartment(params.departments);
    }
  };

  useFocusEffect(React.useCallback(fetch, [null]));

  const states = [state.schools.info, state.departments.info];

  return (
    <View style={styles.page}>
      {states.some((s) => s.loading) && <ProgressBar indeterminate />}
      {states.some((s) => s.error) && (
        <ErrorMessage type="axios" error={states.map((s) => s.error)} retry={fetch} />
      )}
      <ScrollView>
        <View style={styles.centerIllustrationContainer}>
          <Illustration name="configure" height={200} width={200} />
          <View style={[styles.contentContainer, { alignItems: 'center' }]}>
            <Text>Choisissez les écoles et départements dont vous voulez voir les articles.</Text>

            <Text>Ces paramètres s&apos;appliquent aux articles seulement. </Text>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('Landing', { screen: 'SelectLocation' })}
            >
              <Text style={[styles.link, styles.primaryText]}>Changer d&apos;école</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <Divider />
        <InlineCard
          title="Écoles"
          subtitle={
            params.schools?.length
              ? params.schools
                  .map(
                    (s) =>
                      schools?.find((t) => t._id === s)?.displayName ||
                      schools?.find((t) => t._id === s)?.name,
                  )
                  .join(', ')
              : 'Aucun'
          }
          icon="school"
          onPress={() => navigation.navigate('EditParams', { type: 'schools' })}
        />
        <InlineCard
          title="Departements"
          subtitle={
            params.departments
              ?.map((d) =>
                departments.filter((e) => e.type === 'departement')?.find((e) => e._id === d),
              )
              .filter((d) => d)?.length
              ? params.departments
                  .map(
                    (d) =>
                      departments.filter((e) => e.type === 'departement')?.find((e) => e._id === d)
                        ?.displayName ||
                      departments.filter((e) => e.type === 'departement')?.find((e) => e._id === d)
                        ?.name,
                  )
                  .filter((d) => d)
                  .join(', ')
              : 'Aucun'
          }
          icon="map-marker-radius"
          onPress={() => navigation.navigate('EditParams', { type: 'departements' })}
        />
        <InlineCard
          title="Régions"
          subtitle={
            params.departments
              ?.map((d) => departments.filter((e) => e.type === 'region')?.find((e) => e._id === d))
              .filter((d) => d)?.length
              ? params.departments
                  .map(
                    (d) =>
                      departments.filter((e) => e.type === 'region')?.find((e) => e._id === d)
                        ?.displayName ||
                      departments.filter((e) => e.type === 'region')?.find((e) => e._id === d)
                        ?.name,
                  )
                  .filter((d) => d)
                  .join(', ')
              : 'Aucun'
          }
          icon="map-marker-radius"
          onPress={() => navigation.navigate('EditParams', { type: 'regions' })}
        />
        <InlineCard
          title="Autres"
          subtitle={params.global ? 'France entière' : 'Aucun'}
          icon="flag"
          onPress={() => navigation.navigate('EditParams', { type: 'other', hideSearch: true })}
        />
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { articleData, schools, departments } = state;
  return {
    params: articleData.params,
    schools: schools.items,
    departments: departments.items,
    state: {
      schools: schools.state,
      departments: departments.state,
    },
  };
};

export default connect(mapStateToProps)(ArticleParams);

const tagPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
});

ArticleParams.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  params: PropTypes.shape().isRequired,
  schools: PropTypes.arrayOf(tagPropType).isRequired,
  departments: PropTypes.arrayOf(tagPropType).isRequired,
  tags: PropTypes.arrayOf(tagPropType).isRequired,
  groups: PropTypes.arrayOf(tagPropType).isRequired,
  state: PropTypes.shape({
    schools: PropTypes.shape({
      info: PropTypes.shape({}).isRequired,
    }).isRequired,
    departments: PropTypes.shape({
      info: PropTypes.shape({}).isRequired,
    }).isRequired,
    tags: PropTypes.shape({
      info: PropTypes.shape({}).isRequired,
    }).isRequired,
    groups: PropTypes.shape({
      info: PropTypes.shape({}).isRequired,
    }).isRequired,
  }).isRequired,
};
