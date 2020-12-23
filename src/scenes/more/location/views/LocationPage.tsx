import { RouteProp } from '@react-navigation/native';
import React from 'react';

import LocationSelectPage from '@components/LocationSelectPage';
import { ReduxLocation } from '@ts/types';

import type { MoreScreenNavigationProp, MoreStackParams } from '../../index';

type GroupAddLocationProps = {
  navigation: MoreScreenNavigationProp<'Location'>;
  route: RouteProp<MoreStackParams, 'Location'>;
};

export type LocationStackParams = {
  hideSearch: boolean;
  type: 'schools' | 'regions' | 'departements' | 'other';
  initialData: ReduxLocation;
  callback: (location: ReduxLocation) => any;
  subtitle?: string;
};

const GroupAddLocation: React.FC<GroupAddLocationProps> = ({ navigation, route }) => {
  const { hideSearch = false, type, initialData, callback, subtitle } = route.params;

  return (
    <LocationSelectPage
      initialData={initialData}
      type={type}
      hideSearch={hideSearch}
      callback={(location) => {
        callback(location);
        navigation.goBack();
      }}
      headerOptions={{
        subtitle,
      }}
    />
  );
};

export default GroupAddLocation;
