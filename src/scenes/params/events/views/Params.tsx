import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { ProgressBar, Text, Divider } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  ErrorMessage,
  InlineCard,
  Illustration,
  TranslucentStatusBar,
  CustomHeaderBar,
} from '@components/index';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import getStyles from '@styles/Styles';
import {
  EventParams,
  Department,
  School,
  SchoolRequestState,
  DepartmentRequestState,
  State,
} from '@ts/types';
import { useTheme } from '@utils/index';

import type { EventParamsScreenNavigationProp } from '../index';

type EventParamsProps = {
  navigation: EventParamsScreenNavigationProp<'Params'>;
  params: EventParams;
  schools: School[];
  departments: Department[];
  reqState: {
    schools: SchoolRequestState;
    departments: DepartmentRequestState;
  };
};

const EventParamsScreen: React.FC<EventParamsProps> = ({
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
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Localisation',
              subtitle: 'Évènements',
            },
          },
        }}
      />
      {states.some((s) => s.loading) && <ProgressBar indeterminate />}
      {states.some((s) => s.error) && (
        <ErrorMessage
          type="axios"
          error={states.map((s) => s.error)}
          retry={fetch}
          strings={{
            what: 'la récupération des localisations',
            contentSingular: 'La liste de localisations',
            contentPlural: 'Les localisations',
          }}
        />
      )}
      <ScrollView>
        <View style={styles.centerIllustrationContainer}>
          <Illustration name="configure" height={200} width={200} />
          <View style={[styles.contentContainer, { alignItems: 'center' }]}>
            <Text>Choisissez les écoles et départements dont vous voulez voir les évènements.</Text>

            <Text>Ces paramètres s&apos;appliquent aux évènements seulement. </Text>
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
  const { eventData, schools, departments } = state;
  return {
    params: eventData.params,
    schools: schools.items,
    departments: departments.items,
    reqState: {
      schools: schools.state,
      departments: departments.state,
    },
  };
};

export default connect(mapStateToProps)(EventParamsScreen);
