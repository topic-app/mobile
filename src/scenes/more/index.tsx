import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { MainScreenNavigationProp } from '../Main';
import AboutStackNavigator, { AboutStackParams } from './about/index';
import LocationScreen, { LocationStackParams } from './location/LocationPage';
import ModerationStackNavigator, { ModerationStackParams } from './moderation/index';
import MyGroupStackNavigator, { MyGroupsStackParams } from './myGroups/index';
import NotificationsScreen from './notifications/views/Notifications';
import ProfileStackNavigator, { ProfileStackParams } from './profile/index';
import SettingsStackNavigator, { SettingsStackParams } from './settings/index';

export type MoreStackParams = {
  Profile: NavigatorScreenParams<ProfileStackParams>;
  Settings: NavigatorScreenParams<SettingsStackParams>;
  MyGroups: NavigatorScreenParams<MyGroupsStackParams>;
  Moderation: NavigatorScreenParams<ModerationStackParams>;
  About: NavigatorScreenParams<AboutStackParams>;
  List: undefined;
  Notifications: undefined;
  Location: LocationStackParams;
};

export type MoreScreenNavigationProp<K extends keyof MoreStackParams> = CompositeNavigationProp<
  NativeStackNavigationProp<MoreStackParams, K>,
  MainScreenNavigationProp<'More'>
>;

const Stack = createNativeStackNavigator<MoreStackParams>();

function MoreStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyGroups"
        component={MyGroupStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Moderation"
        component={ModerationStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="About" component={AboutStackNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Location" component={LocationScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default MoreStackNavigator;
