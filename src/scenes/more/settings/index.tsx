import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MoreScreenNavigationProp } from '../index';
import SettingsContent from './views/Content';
import SettingsDev from './views/Dev';
import SettingsList from './views/List';
import SettingsPrivacy from './views/Privacy';
import SettingsTheme from './views/Theme';

export type SettingsStackParams = {
  List: undefined;
  Theme: undefined;
  Privacy: undefined;
  Content: undefined;
  Dev: undefined;
};

export type SettingsScreenNavigationProp<
  K extends keyof SettingsStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<SettingsStackParams, K>,
  MoreScreenNavigationProp<'Settings'>
>;

const Stack = createNativeStackNavigator<SettingsStackParams>();

const SettingsStackNavigator: React.FC<{}> = () => {
  return (
    <Stack.Navigator
      initialRouteName="List"
      screenOptions={{ headerShown: false, title: 'Paramètres' }}
    >
      <Stack.Screen name="List" component={SettingsList} />
      <Stack.Screen name="Theme" component={SettingsTheme} />
      <Stack.Screen name="Privacy" component={SettingsPrivacy} />
      <Stack.Screen name="Content" component={SettingsContent} />
      <Stack.Screen name="Dev" component={SettingsDev} />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
