import { CompositeNavigationProp } from '@react-navigation/core';
import {
  createStackNavigator,
  TransitionPresets,
  StackNavigationProp,
} from '@react-navigation/stack';
import React from 'react';
import { Platform } from 'react-native';

import { AppScreenNavigationProp } from '@src/index';

import LandingBeta from './Beta';
import LandingInfo from './Info';
import SelectLocation from './SelectLocation';
import LandingWelcome from './Welcome';

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
      initialRouteName="Welcome"
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS, headerShown: false }}
    >
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
        options={{ title: 'Localisation' }}
      />
      <Stack.Screen name="Welcome" component={LandingWelcome} options={{ title: 'Bienvenue' }} />
      <Stack.Screen name="Info" component={LandingInfo} options={{ title: 'Bienvenue' }} />
      <Stack.Screen name="Beta" component={LandingBeta} options={{ title: 'Bienvenue' }} />
    </Stack.Navigator>
  );
}

export default LandingStackNavigator;
