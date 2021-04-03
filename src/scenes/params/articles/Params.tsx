import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { Text, Divider, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { InlineCard, Illustration, PageContainer } from '@components';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import getStyles from '@styles/global';
import {
  ArticleParams,
  Department,
  DepartmentRequestState,
  School,
  SchoolRequestState,
  State,
} from '@ts/types';

import type { ArticleParamsScreenNavigationProp } from '.';

type ArticleParamsProps = {
  navigation: ArticleParamsScreenNavigationProp<'Params'>;
  params: ArticleParams;
  schools: School[];
  departments: Department[];
  reqState: {
    schools: SchoolRequestState;
    departments: DepartmentRequestState;
  };
};

const ArticleParamsScreen: React.FC<ArticleParamsProps> = ({
  navigation,
  params,
  schools,
  departments,
  reqState,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

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
    <PageContainer
      headerOptions={{ title: 'Localisation', subtitle: 'Articles' }}
      loading={states.some((s) => s.loading)}
      showError={states.some((s) => s.error)}
      errorOptions={{
        type: 'axios',
        error: states.map((s) => s.error),
        strings: {
          what: 'la récupération des localisations',
          contentSingular: 'La liste de localisations',
          contentPlural: 'Les localisations',
        },
        retry: fetch,
      }}
      scroll
    >
      <View style={styles.centerIllustrationContainer}>
        <Illustration name="configure" height={200} width={200} />
        <View style={[styles.contentContainer, { alignItems: 'center' }]}>
          <Text>Choisissez les écoles et départements dont vous voulez voir les articles.</Text>

          <Text>Ces paramètres s&apos;appliquent aux articles seulement. </Text>
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
                    departments.filter((e) => e.type === 'region')?.find((e) => e._id === d)?.name,
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
    </PageContainer>
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

export default connect(mapStateToProps)(ArticleParamsScreen);
