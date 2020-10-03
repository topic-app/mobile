import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import { HeaderConfig } from '@components/Header';

import Profile from './views/Profile';
import ProfileAvatar from './views/Avatar';
import ProfileEdit from './views/Edit';

const Stack = createNativeStackNavigator();

function ProfileStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Avatar"
        component={ProfileAvatar}
        options={{
          ...HeaderConfig,
          title: 'Avatar',
          subtitle: 'Mon Profil',
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
