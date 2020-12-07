import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MainScreenNavigationProp } from '../Main';
import HomeTwoNavigator, { HomeTwoNavParams } from './HomeTwo';

export type HomeOneNavParams = {
  Home2: NavigatorScreenParams<HomeTwoNavParams>;
};

export type HomeOneScreenNavigationProp<K extends keyof HomeOneNavParams> = CompositeNavigationProp<
  NativeStackNavigationProp<HomeOneNavParams, K>,
  MainScreenNavigationProp<'Home1'>
>;

const Stack = createNativeStackNavigator<HomeOneNavParams>();

function HomeOneNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home2" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home2" component={HomeTwoNavigator} />
    </Stack.Navigator>
  );
}

export default HomeOneNavigator;
