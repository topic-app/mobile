import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MainScreenNavigationProp } from '../Main';
import PageDisplay from './Display';
import PageSandbox from './Sandbox.web';

export type PagesStackParams = {
  Display: { group: string; page?: string };
  Sandbox: undefined;
};

export type PagesScreenNavigationProp<K extends keyof PagesStackParams> = CompositeNavigationProp<
  NativeStackNavigationProp<PagesStackParams, K>,
  MainScreenNavigationProp<'Pages'>
>;

const Stack = createNativeStackNavigator<PagesStackParams>();

const SettingsStackNavigator: React.FC<{}> = () => {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={PageDisplay} />
      <Stack.Screen name="Sandbox" component={PageSandbox} />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;
