import React from 'react';
import { Platform } from 'react-native';

import { createNativeStackNavigator } from '@utils/stack';

import MoreList from './list/views/List'; // This is the iOS 'more' menu (equivalent to drawer in Android)
import ProfileStackNavigator from './profile/index';
import SettingsStackNavigator from './settings/index';
import MyGroupStackNavigator from './myGroups/index';
import ModerationStackNavigator from './moderation/index';
import AboutStackNavigator from './about/index';

const Stack = createNativeStackNavigator();

function MoreStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileStackNavigator} />
      <Stack.Screen name="Settings" component={SettingsStackNavigator} />
      <Stack.Screen name="MyGroups" component={MyGroupStackNavigator} />
      <Stack.Screen name="Moderation" component={ModerationStackNavigator} />
      <Stack.Screen name="About" component={AboutStackNavigator} options={{ headerShown: false }} />
      {Platform.OS === 'ios' && <Stack.Screen name="List" component={MoreList} />}
    </Stack.Navigator>
  );
}

export default MoreStackNavigator;
