import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MoreScreenNavigationProp } from '..';
import Profile from './Profile';

export type ProfileStackParams = {
  Profile: undefined;
};

export type ProfileScreenNavigationProp<
  K extends keyof ProfileStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParams, K>,
  MoreScreenNavigationProp<'Profile'>
>;

const Stack = createNativeStackNavigator();

function ProfileStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} options={{ title: 'Mon profil' }} />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;
