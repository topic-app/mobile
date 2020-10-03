import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { HeaderConfig } from '@components/index';

import SettingsList from './views/List';
import SettingsTheme from './views/Theme';
import SettingsPrivacy from './views/Privacy';
import SettingsContent from './views/Content';

const Stack = createNativeStackNavigator();

const SettingsStackNavigator: React.FC<{}> = () => {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen
        name="List"
        component={SettingsList}
        options={{
          ...HeaderConfig,
          title: 'Paramètres',
          headerShown: false,
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
      <Stack.Screen
        name="Content"
        component={SettingsContent}
        options={{
          ...HeaderConfig,
          title: 'Contenu et accessibilité',
          subtitle: 'Paramètres',
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
