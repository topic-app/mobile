import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import { HeaderConfig } from '@components/index';

import SettingsList from './views/List';
import SettingsTheme from './views/Theme';
import SettingsPrivacy from './views/Privacy';
import SettingsContent from './views/Content';

const Stack = createNativeStackNavigator();

const SettingsStackNavigator: React.FC<{}> = () => {
  return (
    <Stack.Navigator initialRouteName="List" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="List" component={SettingsList} />
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
      <Stack.Screen name="Content" component={SettingsContent} />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
