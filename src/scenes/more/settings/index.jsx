import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsList from './views/List';
import SettingsTheme from './views/Theme';

import { HeaderConfig } from '../../../components/Header';

const Stack = createStackNavigator();

function SettingsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen
        name="List"
        component={SettingsList}
        options={{
          ...HeaderConfig,
          title: 'Paramètres',
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        }}
      />
      <Stack.Screen
        name="Theme"
        component={SettingsTheme}
        options={{
          ...HeaderConfig,
          title: 'Thème',
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingsStackNavigator;
