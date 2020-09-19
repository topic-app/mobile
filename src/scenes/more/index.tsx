import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';

import MoreList from './list/views/List'; // This is the iOS 'more' menu (equivalent to drawer in Android)
import ProfileStackNavigator from './profile/index';
import SettingsStackNavigator from './settings/index';
import MyGroupStackNavigator from './myGroups/index';
import ModerationStackNavigator from './moderation/index';
import AboutStackNavigator from './about/index';
import UnauthorizedBeta from '@components/UnauthorizedBeta';

const Stack = createStackNavigator();

function MoreStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile">
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
      <Stack.Screen name="About" component={AboutStackNavigator} options={{ headerShown: false }} />
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
