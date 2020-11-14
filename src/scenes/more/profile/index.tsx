import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import Profile from './views/Profile';
import ProfileAvatar from './views/Avatar';
import ProfileEdit from './views/Edit';

export type ProfileStackParams = {
  Profile: undefined;
  Avatar: undefined;
  Edit: undefined;
};

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
