import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { DisplayScreenNavigationProp } from '../index';
import PetitionDisplay from './views/Display';

export type PetitionDisplayStackParams = {
  Display: { id: string };
};

export type PetitionDisplayScreenNavigationProp<
  K extends keyof PetitionDisplayStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<PetitionDisplayStackParams, K>,
  DisplayScreenNavigationProp<'Petition'>
>;

const Stack = createNativeStackNavigator();

function PetitionDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={PetitionDisplay} />
    </Stack.Navigator>
  );
}

export default PetitionDisplayStackNavigator;
