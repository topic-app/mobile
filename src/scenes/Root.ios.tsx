import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { AppScreenNavigationProp } from '..';
import MainStackNavigator, { MainStackParams } from './Main';

export type RootNavParams = {
  Main: NavigatorScreenParams<MainStackParams>;
};

export type RootScreenNavigationProp<K extends keyof RootNavParams> = CompositeNavigationProp<
  NativeStackNavigationProp<RootNavParams, K>,
  AppScreenNavigationProp<'Root'>
>;

const Stack = createNativeStackNavigator<RootNavParams>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainStackNavigator} />
    </Stack.Navigator>
  );
}

export default RootNavigator;
