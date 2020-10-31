import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import SettingsList from './views/List';
import SettingsTheme from './views/Theme';
import SettingsPrivacy from './views/Privacy';
import SettingsContent from './views/Content';

export type SettingsStackParams = {
  List: undefined;
  Theme: undefined;
  Privacy: undefined;
  Content: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParams>();

const SettingsStackNavigator: React.FC<{}> = () => {
  return (
    <Stack.Navigator initialRouteName="List" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="List" component={SettingsList} />
      <Stack.Screen name="Theme" component={SettingsTheme} />
      <Stack.Screen name="Privacy" component={SettingsPrivacy} />
      <Stack.Screen name="Content" component={SettingsContent} />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
