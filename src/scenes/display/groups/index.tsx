import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { DisplayScreenNavigationProp } from '../index';
import GroupDescription from './views/Description';
import GroupDisplay from './views/Display';

export type GroupDisplayStackParams = {
  Display: { id: string; verification: boolean };
  Description: { id: string };
};

export type GroupDisplayScreenNavigationProp<
  K extends keyof GroupDisplayStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<GroupDisplayStackParams, K>,
  DisplayScreenNavigationProp<'Group'>
>;

const Stack = createNativeStackNavigator<GroupDisplayStackParams>();

function GroupDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={GroupDisplay} options={{ title: 'Groupe' }} />
      <Stack.Screen name="Description" component={GroupDescription} options={{ title: 'Groupe' }} />
    </Stack.Navigator>
  );
}

export default GroupDisplayStackNavigator;
