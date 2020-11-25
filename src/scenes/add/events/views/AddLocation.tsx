import { RouteProp } from '@react-navigation/native';
import React from 'react';

import LocationSelectPage from '@components/LocationSelectPage';

import type { EventAddScreenNavigationProp, EventAddStackParams } from '../index';

type EventAddLocationProps = {
  navigation: EventAddScreenNavigationProp<'Location'>;
  route: RouteProp<EventAddStackParams, 'Location'>;
};

const EventAddLocation: React.FC<EventAddLocationProps> = ({ navigation, route }) => {
  const { hideSearch = false, type, initialData, callback } = route.params;

  return (
    <LocationSelectPage
      initialData={initialData}
      type={type}
      hideSearch={hideSearch}
      callback={(location) => {
        callback(location);
        navigation.goBack();
      }}
    />
  );
};

export default EventAddLocation;
