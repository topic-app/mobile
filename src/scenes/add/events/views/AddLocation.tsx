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

type EventEditParamsProps = {
  navigation: Navigation;
  route: {
    params: {
      type: 'schools' | 'departements' | 'regions' | 'other';
      hideSearch: boolean;
      callback: (location: ReduxLocation) => any;
      initialData: ReduxLocation;
    };
  };
};

function EventAddLocation({ navigation, route }: EventEditParamsProps) {
  const { hideSearch = false, type, initialData, callback } = route.params;

  return (
    <LocationSelectPage
      initialData={initialData}
      type={type}
      hideSearch={hideSearch}
      callback={(location: ReduxLocation) => {
        callback(location);
        navigation.goBack();
      }}
    />
  );
}

export default EventAddLocation;
