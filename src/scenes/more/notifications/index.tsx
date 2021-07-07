import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { MoreScreenNavigationProp } from '..';
import Notifications from './Notifications';

export type NotificationsStackParams = {
  Profile: undefined;
};

export type NotificationsScreenNavigationProp<
  K extends keyof NotificationsStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<NotificationsStackParams, K>,
  MoreScreenNavigationProp<'Notifications'>
>;

const Stack = createNativeStackNavigator();

function NotificationsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Notifications" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ title: 'Mon profil' }}
      />
    </Stack.Navigator>
  );
}

export default NotificationsStackNavigator;
