import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { DisplayScreenNavigationProp } from '../index';
import LocationDisplay from './views/Display';

export type LocationDisplayStackParams = {
  Display: { id: string };
};

export type LocationDisplayScreenNavigationProp<
  K extends keyof LocationDisplayStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<LocationDisplayStackParams, K>,
  DisplayScreenNavigationProp<'Location'>
>;

const Stack = createNativeStackNavigator();

function LocationDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={LocationDisplay} options={{ title: 'Localisation' }} />
    </Stack.Navigator>
  );
}

export default LocationDisplayStackNavigator;
