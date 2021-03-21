// @ts-nocheck
import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { AddScreenNavigationProp } from '../index';
import PetitionAdd from './views/Add';

export type PetitionAddStackParams = {
  Add: undefined;
};

export type PetitionAddScreenNavigationProp<
  K extends keyof PetitionAddStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<PetitionAddStackParams, K>,
  AddScreenNavigationProp<'Petition'>
>;

const Stack = createNativeStackNavigator<PetitionAddStackParams>();

function PetitionAddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Add">
      <Stack.Screen
        name="Add"
        component={PetitionAdd}
        options={{
          title: 'Créer une pétition',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default PetitionAddStackNavigator;
