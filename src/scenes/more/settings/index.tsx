import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';

import SettingsList from './views/List';
import SettingsTheme from './views/Theme';

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
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        }}
      />
      <Stack.Screen
        name="Theme"
        component={SettingsTheme}
        options={{
          ...HeaderConfig,
          title: 'Thème',
          subtitle: 'Paramètres',
          overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingsStackNavigator;
