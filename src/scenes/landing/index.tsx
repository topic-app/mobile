import { CompositeNavigationProp } from '@react-navigation/core';
import {
  createStackNavigator,
  TransitionPresets,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import { Platform } from 'react-native';

import { AppScreenNavigationProp } from '@src/index';

import LandingBeta from './views/Beta';
import LandingInfo from './views/Info';
import SelectLocation from './views/SelectLocation';
import LandingWelcome from './views/Welcome';

export type LandingStackParams = {
  Welcome: undefined;
  SelectLocation: undefined;
  Info: { index: number };
  Beta: undefined;
};

export type LandingScreenNavigationProp<
  K extends keyof LandingStackParams
> = CompositeNavigationProp<
  StackNavigationProp<LandingStackParams, K>,
  AppScreenNavigationProp<'Landing'>
>;

const Stack = createStackNavigator<LandingStackParams>();

function LandingStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={Platform.OS === 'web' ? 'SelectLocation' : 'Welcome'}
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS, headerShown: false }}
    >
      <Stack.Screen name="SelectLocation" component={SelectLocation} />
      <Stack.Screen name="Welcome" component={LandingWelcome} />
      <Stack.Screen name="Info" component={LandingInfo} />
      <Stack.Screen name="Beta" component={LandingBeta} />
    </Stack.Navigator>
  );
}

export default LandingStackNavigator;
