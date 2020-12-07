import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MoreScreenNavigationProp } from '../index';
import types from './data/types.json';
import Linking from './views/Linking';

export type LinkingStackParams = {
  Linking: {
    type: keyof typeof types;
    [key: string]: string;
  };
};

export type LinkingScreenNavigationProp<
  K extends keyof LinkingStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<LinkingStackParams, K>,
  MoreScreenNavigationProp<'Linking'>
>;

const Stack = createNativeStackNavigator<LinkingStackParams>();

function LinkingStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Linking">
      <Stack.Screen name="Linking" component={Linking} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default LinkingStackNavigator;
