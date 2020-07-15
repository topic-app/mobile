import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, Divider, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { ErrorMessage, InlineCard, Illustration } from '@components/index';
import { fetchSchool } from '@redux/actions/api/schools';
import { fetchDepartment } from '@redux/actions/api/departments';
import { fetchTag } from '@redux/actions/api/tags';
import { fetchGroup } from '@redux/actions/api/groups';
import getStyles from '@styles/Styles';

function ArticleConfigure({ params, schools, departments, tags, groups, state }) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const fetch = () => {
    if (params.schools) {
      params.schools.forEach((s) => fetchSchool(s));
    }
    if (params.departments) {
      params.departments.forEach((d) => fetchDepartment(d));
    }
    if (params.tags) {
      params.tags.forEach((t) => fetchTag(t));
    }
    if (params.groupss) {
      params.groupss.forEach((g) => fetchGroup(g));
    }
  };

  useFocusEffect(React.useCallback(fetch, [null]));

  const states = [state.schools.info, state.departments.info, state.tags.info, state.groups.info];

  return (
    <View style={styles.page}>
      {states.some((s) => s.loading) && <ProgressBar indeterminate />}
      {states.some((s) => s.error) && (
        <ErrorMessage type="axios" error={states.map((s) => s.error)} retry={fetch} />
      )}
      <ScrollView>
        <View style={styles.centerIllustrationContainer}>
          <Illustration name="configure" height={200} width={200} />
        </View>
        <Divider />
        <InlineCard
          title="Écoles"
          subtitle={
            params.schools?.length
              ? params.schools.map((s) => schools.find((t) => t._id === s)?.displayName).join(', ')
              : 'Aucun'
          }
          icon="school"
          onPress={() => {}}
        />
        <InlineCard
          title="Departements"
          subtitle={
            params.departments
              ?.map((d) =>
                departments.filter((e) => e.type === 'department')?.find((e) => e._id === d),
              )
              .filter((d) => d)?.length
              ? params.departments
                  .map(
                    (d) =>
                      departments.filter((e) => e.type === 'department')?.find((e) => e._id === d)
                        ?.displayName,
                  )
                  .filter((d) => d)
                  .join(', ')
              : 'Aucun'
          }
          icon="map-marker-radius"
          onPress={() => console.log('Animations')}
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
                        ?.displayName,
                  )
                  .filter((d) => d)
                  .join(', ')
              : 'Aucun'
          }
          icon="map-marker-radius"
          onPress={() => console.log('Animations')}
        />
        <InlineCard
          title="France entière"
          subtitle={params.global ? 'Oui' : 'Non'}
          icon="flag"
          onPress={() => console.log('Animations')}
        />
        <Divider />
        <InlineCard
          title="Tags"
          subtitle={
            params.tags?.length
              ? params.tags.map((s) => tags.find((t) => t._id === s)?.displayName).join(', ')
              : 'Aucun'
          }
          icon="tag-multiple"
          onPress={() => console.log('Notification')}
        />
        <InlineCard
          title="Groupes"
          subtitle={
            params.groups?.length
              ? params.groups.map((s) => groups.find((t) => t._id === s)?.displayName).join(', ')
              : 'Aucun'
          }
          icon="account-group"
          onPress={() => console.log('Notification')}
        />
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { articleData, schools, departments, tags, groups } = state;
  return {
    params: articleData.params,
    schools: schools.data,
    departments: departments.data,
    tags: tags.data,
    groups: groups.data,
    state: {
      schools: schools.state,
      departments: departments.state,
      tags: tags.state,
      groups: groups.state,
    },
  };
};

export default connect(mapStateToProps)(ArticleConfigure);

const tagPropType = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
});

ArticleConfigure.propTypes = {
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
