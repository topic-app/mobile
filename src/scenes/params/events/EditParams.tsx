import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { connect } from 'react-redux';

import LocationSelectPage from '@components/LocationSelectPage';
import { fetchMultiDepartment } from '@redux/actions/api/departments';
import { fetchMultiSchool } from '@redux/actions/api/schools';
import { updateEventParams } from '@redux/actions/contentData/events';
import { State, ReduxLocation, EventParams } from '@ts/types';

import type { EventParamsScreenNavigationProp, EventParamsStackParams } from '.';

type Navigation = EventParamsScreenNavigationProp<'EditParams'>;

function done(
  { schools, departments, global }: Partial<ReduxLocation>,
  type: 'schools' | 'departements' | 'regions' | 'other',
  navigation: Navigation,
) {
  updateEventParams({
    schools,
    departments,
    global,
  }).then(() => {
    if (type === 'schools' && schools) {
      fetchMultiSchool(schools);
    } else if ((type === 'departements' || type === 'regions') && departments) {
      fetchMultiDepartment(departments);
    }
    navigation.goBack();
  });
}

type EventEditParamsProps = {
  navigation: EventParamsScreenNavigationProp<'EditParams'>;
  route: RouteProp<EventParamsStackParams, 'EditParams'>;
  eventParams: EventParams;
};

const EventEditParams: React.FC<EventEditParamsProps> = ({ navigation, eventParams, route }) => {
  const { hideSearch, type } = route.params;

  return (
    <LocationSelectPage
      initialData={eventParams}
      type={type}
      hideSearch={hideSearch}
      callback={(location) => done(location, type, navigation)}
    />
  );
};

const mapStateToProps = (state: State) => {
  const { eventData } = state;
  return { eventParams: eventData.params };
};

export default connect(mapStateToProps)(EventEditParams);
