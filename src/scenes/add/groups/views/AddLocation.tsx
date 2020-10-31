import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { ReduxLocation } from '@ts/types';
import LocationSelectPage from '@components/LocationSelectPage';

import type { GroupAddStackParams } from '../index';

type GroupAddLocationProps = StackScreenProps<GroupAddStackParams, 'Location'>;

const GroupAddLocation: React.FC<GroupAddLocationProps> = ({ navigation, route }) => {
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
      headerOptions={{
        subtitle: 'Créer un groupe',
      }}
    />
  );
};

export default GroupAddLocation;
