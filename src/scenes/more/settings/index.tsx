import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { MoreScreenNavigationProp } from '..';
import SettingsContent from './Content';
import SettingsDev from './Dev';
import SettingsList from './List';
import SettingsPrivacy from './Privacy';
import SettingsSelectLocation from './SelectLocation';
import SettingsTheme from './Theme';

export type SettingsStackParams = {
  List: undefined;
  Theme: undefined;
  Content: undefined;
  Privacy: undefined;
  Appearance: undefined;
  Dev: undefined;
  SelectLocation: undefined;
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
      <Stack.Screen name="Theme" component={SettingsTheme} />
      <Stack.Screen name="Content" component={SettingsContent} />
      <Stack.Screen name="Dev" component={SettingsDev} />
      <Stack.Screen
        name="SelectLocation"
        component={SettingsSelectLocation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
