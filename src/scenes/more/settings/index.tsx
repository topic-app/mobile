import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';

import SettingsList from './views/List';
import SettingsTheme from './views/Theme';
import SettingsPrivacy from './views/Privacy';

const Stack = createStackNavigator();

function SettingsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="List" screenOptions={TransitionPresets.SlideFromRightIOS}>
      <Stack.Screen
        name="List"
        component={SettingsList}
        options={{
          ...HeaderConfig,
          title: 'Paramètres',
        }}
      />
      <Stack.Screen
        name="Theme"
        component={SettingsTheme}
        options={{
          ...HeaderConfig,
          title: 'Thème',
          subtitle: 'Paramètres',
        }}
      />
      <Stack.Screen
        name="Privacy"
        component={SettingsPrivacy}
        options={{
          ...HeaderConfig,
          title: 'Vie privée',
          subtitle: 'Paramètres',
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingsStackNavigator;
