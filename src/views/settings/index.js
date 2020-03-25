// eslint-disable-next-line no-unused-vars
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsHomeScreen from './pages/Settings';
import { customStyles } from '../../styles/Styles';

const Stack = createStackNavigator();

function SettingsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={customStyles.header}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsHomeScreen}
      />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;
