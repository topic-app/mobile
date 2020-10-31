import React from 'react';
import { View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { ProgressBar, Text, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';

import {
  ArticleParams,
  Department,
  DepartmentRequestState,
  School,
  SchoolRequestState,
  State,
} from '@ts/types';
import { ErrorMessage, InlineCard, Illustration } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import { ArticleConfigureStackParams } from '..';

type ArticleParamsProps = {
  navigation: StackNavigationProp<ArticleConfigureStackParams, 'Params'>;
  params: ArticleParams;
  schools: School[];
  departments: Department[];
  reqState: {
    schools: SchoolRequestState;
    departments: DepartmentRequestState;
  };
};

const ArticleParams: React.FC<ArticleParamsProps> = ({
  navigation,
  params,
  schools,
  departments,
  reqState,
}) => {
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

  const states = [reqState.schools.info, reqState.departments.info];

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
};

const mapStateToProps = (state: State) => {
  const { articleData, schools, departments } = state;
  return {
    params: articleData.params,
    schools: schools.items,
    departments: departments.items,
    reqState: {
      schools: schools.state,
      departments: departments.state,
    },
  };
};

export default connect(mapStateToProps)(ArticleParams);
