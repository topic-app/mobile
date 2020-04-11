import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsList from './views/List';
import SettingsThemeCreator from './views/ThemeCreator';

const Stack = createStackNavigator();

function SettingsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="List" headerMode="none">
      <Stack.Screen name="List" component={SettingsList} />
      <Stack.Screen name="ThemeCreator" component={SettingsThemeCreator} />
    </Stack.Navigator>
  );
}

export default SettingsStackNavigator;
