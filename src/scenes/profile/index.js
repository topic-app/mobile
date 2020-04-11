import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from './views/Profile';
import ProfileAvatar from './views/Avatar';
import ProfileEdit from './views/Edit';

const Stack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile" headerMode="none">
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Avatar" component={ProfileAvatar} />
      <Stack.Screen name="Edit" component={ProfileEdit} />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;
