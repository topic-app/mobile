import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { MoreScreenNavigationProp } from '..';
import SettingsAppearance from './Appearance';
import SettingsDev from './Dev';
import SettingsList from './List';
import SettingsPrivacy from './Privacy';

export type SettingsStackParams = {
  List: undefined;
  Theme: undefined;
  Privacy: undefined;
  Appearance: undefined;
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
      <Stack.Screen name="Privacy" component={SettingsPrivacy} />
      <Stack.Screen name="Appearance" component={SettingsAppearance} />
      <Stack.Screen name="Dev" component={SettingsDev} />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
