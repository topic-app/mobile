import React from 'react';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { connect } from 'react-redux';

import { State, ReduxLocation } from '@ts/types';
import { updateEventParams } from '@redux/actions/contentData/events';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import LocationSelectPage from '@components/LocationSelectPage';
import { fetchMultiDepartment } from '@redux/actions/api/departments';

import type { EventConfigureStackParams } from '../index';

type Navigation = StackNavigationProp<EventConfigureStackParams, 'EditParams'>;

function done(
  { schools, departments, global }: ReduxLocation,
  type: 'schools' | 'departements' | 'regions' | 'other',
  navigation: Navigation,
) {
  updateEventParams({
    schools,
    departments,
    global,
  }).then(() => {
    if (type === 'schools') {
      fetchMultiSchool(schools);
    } else if (type === 'departements' || type === 'regions') {
      fetchMultiDepartment(departments);
    }
    navigation.goBack();
  });
}

type EventEditParamsProps = StackScreenProps<EventConfigureStackParams, 'EditParams'> & {
  eventParams: ReduxLocation;
};

const EventEditParams: React.FC<EventEditParamsProps> = ({ navigation, eventParams, route }) => {
  const { hideSearch, type } = route.params;

  return (
    <LocationSelectPage
      initialData={eventParams}
      type={type}
      hideSearch={hideSearch}
      callback={(location: ReduxLocation) => done(location, type, navigation)}
    />
  );
};

const mapStateToProps = (state: State) => {
  const { eventData } = state;
  return { eventParams: eventData.params };
};

export default connect(mapStateToProps)(EventEditParams);
