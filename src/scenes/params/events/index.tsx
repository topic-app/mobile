import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import EventParams from './views/Params';
import EventEditParams from './views/EditParams';

export type EventConfigureStackParams = {
  Params: undefined;
  EditParams: {
    type: 'schools' | 'departements' | 'regions' | 'other';
    hideSearch: boolean;
  };
};

const Stack = createNativeStackNavigator<EventConfigureStackParams>();

function EventConfigureStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params">
      <Stack.Screen
        name="Params"
        component={EventParams}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Localisation',
          subtitle: 'Évènements',
        })}
      />
      <Stack.Screen
        name="EditParams"
        component={EventEditParams}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Localisation',
          subtitle: 'Évènements',
        })}
      />
    </Stack.Navigator>
  );
}

export default EventConfigureStackNavigator;
