import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';

import UnauthorizedBeta from '@components/UnauthorizedBeta';

import MoreList from './list/views/List'; // This is the iOS 'more' menu (equivalent to drawer in Android)
import ProfileStackNavigator from './profile/index';
import SettingsStackNavigator from './settings/index';
import MyGroupStackNavigator from './myGroups/index';
import AboutStackNavigator from './about/index';

const Stack = createStackNavigator();

function MoreStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={UnauthorizedBeta} options={{ headerShown: false }} />
      <Stack.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="MyGroups" component={UnauthorizedBeta} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={UnauthorizedBeta} options={{ headerShown: false }} />
      {Platform.OS === 'ios' && (
        <Stack.Screen
          name="List"
          component={MoreList}
          options={{ ...HeaderConfig, title: 'Plus', home: true }}
        />
      )}
    </Stack.Navigator>
  );
}

export default MoreStackNavigator;
