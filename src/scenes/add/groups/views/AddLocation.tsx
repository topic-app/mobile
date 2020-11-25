import { RouteProp } from '@react-navigation/native';
import React from 'react';

import LocationSelectPage from '@components/LocationSelectPage';
import { ReduxLocation } from '@ts/types';

import type { GroupAddScreenNavigationProp, GroupAddStackParams } from '../index';

type GroupAddLocationProps = {
  navigation: GroupAddScreenNavigationProp<'Location'>;
  route: RouteProp<GroupAddStackParams, 'Location'>;
};

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
