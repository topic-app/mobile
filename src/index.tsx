import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';

import Store from '@redux/store';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import RootNavigator, { RootNavParams } from './scenes/Root';
import AuthStackNavigator, { AuthStackParams } from './scenes/auth/index';
import LandingStackNavigator, { LandingStackParams } from './scenes/landing/index';

export type AppStackParams = {
  Auth: NavigatorScreenParams<AuthStackParams>;
  Root: NavigatorScreenParams<RootNavParams>;
  Landing: NavigatorScreenParams<LandingStackParams>;
};

export type AppScreenNavigationProp<K extends keyof AppStackParams> = NativeStackNavigationProp<
  AppStackParams,
  K
>;

const Stack = createNativeStackNavigator<AppStackParams>();

function AppStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={Store.getState().location.selected ? 'Root' : 'Landing'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="Root" component={RootNavigator} />
      <Stack.Screen name="Landing" component={LandingStackNavigator} />
    </Stack.Navigator>
  );
}

export default AppStackNavigator;
