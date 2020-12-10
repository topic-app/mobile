import React from 'react';

import { EventCreationData, ReduxLocation } from '@ts/types';
import { createNativeStackNavigator } from '@utils/stack';

import EventAdd from './views/Add';
import EventAddSuccess from './views/AddSuccess';
import EventAddLocation from './views/AddLocation';

export type EventAddStackParams = {
  Add: undefined;
  Success: { id?: string; creationData?: EventCreationData };
  Location: {
    hideSearch: boolean;
    type: 'schools' | 'departements' | 'regions' | 'other';
    initialData?: ReduxLocation;
    callback: (location: ReduxLocation) => any;
  };
};

const Stack = createNativeStackNavigator<EventAddStackParams>();

function EventAddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Add" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Add" component={EventAdd} options={{ title: 'Créer un évènement' }} />
      <Stack.Screen
        name="Success"
        component={EventAddSuccess}
        options={{ title: 'Évènement ajouté' }}
      />
      <Stack.Screen
        name="Location"
        component={EventAddLocation}
        options={{ title: 'Localisation' }}
      />
    </Stack.Navigator>
  );
}

export default EventAddStackNavigator;
