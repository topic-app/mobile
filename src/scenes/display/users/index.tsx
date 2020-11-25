import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { DisplayScreenNavigationProp } from '../index';
import UserDisplay from './views/Display';

export type UserDisplayStackParams = {
  Display: { id: string };
};

export type UserDisplayScreenNavigationProp<
  K extends keyof UserDisplayStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<UserDisplayStackParams, K>,
  DisplayScreenNavigationProp<'User'>
>;

const Stack = createNativeStackNavigator<UserDisplayStackParams>();

function UserDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen name="Display" component={UserDisplay} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default UserDisplayStackNavigator;
