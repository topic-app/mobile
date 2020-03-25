// eslint-disable-next-line no-unused-vars
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsHomeScreen from './pages/Settings';

const Stack = createStackNavigator();

function SettingsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{ gestureEnabled: false }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsHomeScreen}
      />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;
