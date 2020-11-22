import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import LocationSelectPage from '@components/LocationSelectPage';

import type { EventAddStackParams } from '../index';

type EventAddLocationProps = StackScreenProps<EventAddStackParams, 'Location'>;

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
