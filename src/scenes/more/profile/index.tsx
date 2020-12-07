import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MoreScreenNavigationProp } from '../index';
import ProfileAvatar from './views/Avatar';
import ProfileEdit from './views/Edit';
import Profile from './views/Profile';

export type ProfileStackParams = {
  Profile: undefined;
  Avatar: undefined;
  Edit: undefined;
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
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Avatar" component={ProfileAvatar} />
      <Stack.Screen name="Edit" component={ProfileEdit} />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;
