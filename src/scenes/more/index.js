import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProfileStackNavigator from './profile/index';
import SettingsStackNavigator from './settings/index';
import MoreListNavigator from './list/views/List';
import MyGroupStackNavigator from './myGroups/index';

const Stack = createStackNavigator();

function MoreStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile" headerMode="none">
      <Stack.Screen name="Profile" component={ProfileStackNavigator} />
      <Stack.Screen name="Settings" component={SettingsStackNavigator} />
      <Stack.Screen name="List" component={MoreListNavigator} />
      <Stack.Screen name="MyGroups" component={MyGroupStackNavigator} />
    </Stack.Navigator>
  );
}

export default MoreStackNavigator;
