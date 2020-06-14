import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import RootNavigator from './scenes/Root';
import AuthStackNavigator from './scenes/auth/index';
import LandingStackNavigator from './scenes/landing/index';

const Stack = createStackNavigator();

function AppStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Root"
      headerMode="none"
      screenOptions={TransitionPresets.SlideFromRightIOS}
    >
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="Root" component={RootNavigator} />
      <Stack.Screen name="Landing" component={LandingStackNavigator} />
    </Stack.Navigator>
  );
}

export default AppStackNavigator;
