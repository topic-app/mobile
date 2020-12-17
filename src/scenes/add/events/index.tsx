import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { EventCreationData, ReduxLocation } from '@ts/types';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { AddScreenNavigationProp } from '../index';
import EventAdd from './views/Add';
import EventAddLocation from './views/AddLocation';
import EventAddSuccess from './views/AddSuccess';

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

export type EventAddScreenNavigationProp<
  K extends keyof EventAddStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<EventAddStackParams, K>,
  AddScreenNavigationProp<'Event'>
>;

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
