import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { DisplayScreenNavigationProp } from '..';
import UserDisplay from './Display';

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
      <Stack.Screen
        name="Display"
        component={UserDisplay}
        options={{ title: 'Utilisateur', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default UserDisplayStackNavigator;
