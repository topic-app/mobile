import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';

import Profile from './views/Profile';
import ProfileAvatar from './views/Avatar';
import ProfileEdit from './views/Edit';

const Stack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          ...HeaderConfig,
          title: 'Profile',
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        }}
      />
      <Stack.Screen
        name="Avatar"
        component={ProfileAvatar}
        options={{
          ...HeaderConfig,
          title: 'Profile: Avatar',
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        }}
      />
      <Stack.Screen
        name="Edit"
        component={ProfileEdit}
        options={{
          ...HeaderConfig,
          title: 'Profile: Edit',
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;
