import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';

import { State } from '@ts/types';
import { updateEventParams } from '@redux/actions/contentData/events';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import LocationSelectPage from '@components/LocationSelectPage';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import { ErrorMessage } from '@components/index';

import getStyles from '@styles/Styles';

import type { EventStackParams } from '../index';

type Navigation = StackNavigationProp<EventStackParams, 'EditParams'>;

// TODO: Externalize into @ts/redux
type ReduxLocation = {
  global: boolean;
  schools: string[];
  departments: string[];
};

function done(
  { schools, departments, global }: ReduxLocation,
  type: 'schools' | 'departements' | 'regions' | 'other',
  navigation: Navigation,
) {
  Promise.all([
    updateEventParams({
      schools,
      departments,
      global,
    }),
  ]).then(() => {
    if (type === 'schools') {
      fetchMultiSchool(schools);
    } else if (type === 'departements' || type === 'regions') {
      fetchMultiDepartment(departments);
    }
    navigation.goBack();
  });
}

type EventEditParamsProps = {
  navigation: Navigation;
  eventParams: ReduxLocation;
  route: {
    params: {
      type: 'schools' | 'departements' | 'regions' | 'other';
      hideSearch: boolean;
    };
  };
};

function EventEditParams({ navigation, eventParams, route }: EventEditParamsProps) {
  const { hideSearch, type } = route.params;

  return (
    <LocationSelectPage
      initialData={eventParams}
      type={type}
      hideSearch={hideSearch}
      callback={(location: ReduxLocation) => done(location, type, navigation)}
    />
  );
}

const mapStateToProps = (state: State) => {
  const { eventData } = state;
  return { eventParams: eventData.params };
};

export default connect(mapStateToProps)(EventEditParams);
