import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsList from './views/List';
import SettingsThemeCreator from './views/ThemeCreator';

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
      <Stack.Screen name="ThemeCreator" component={SettingsThemeCreator} />
    </Stack.Navigator>
  );
}

export default SettingsStackNavigator;
