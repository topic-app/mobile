import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DisplayStackNavigator from './display/index';
import ProfileStackNavigator from './profile/index';
import SearchStackNavigator from './search/index';
import SettingsStackNavigator from './settings/index';
import UserContentStackNavigator from './userContent/index';
import DrawerNavigator from './Drawer';

const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="Drawer" headerMode="none">
      <Stack.Screen name="Display" component={DisplayStackNavigator} />
      <Stack.Screen name="Profile" component={ProfileStackNavigator} />
      <Stack.Screen name="Search" component={SearchStackNavigator} />
      <Stack.Screen name="Settings" component={SettingsStackNavigator} />
      <Stack.Screen name="UserContent" component={UserContentStackNavigator} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}

export default MainNavigator;
