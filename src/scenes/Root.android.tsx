import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import { AppStackParams } from '../index';
import MainStackNavigator, { MainStackParams } from './Main';

export type RootNavParams = {
  Main: { screen: keyof MainStackParams; params: MainStackParams[keyof MainStackParams] };
} & AppStackParams;

const Stack = createNativeStackNavigator<RootNavParams>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainStackNavigator} />
    </Stack.Navigator>
  );
}

export default RootNavigator;
