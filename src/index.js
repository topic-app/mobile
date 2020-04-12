import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainNavigator from './scenes/index';
import AuthStackNavigator from './scenes/auth/index';
import LandingStackNavigator from './scenes/landing/index';

const Stack = createStackNavigator();

function RootStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main" headerMode="none">
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen name="Landing" component={LandingStackNavigator} />
    </Stack.Navigator>
  );
}

export default RootStackNavigator;
