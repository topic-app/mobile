import React from 'react';
import { createNativeStackNavigator, TransitionPresets } from '@utils/stack';

import { HeaderConfig } from '@components/Header';
import types from './data/types.json';

import Linking from './views/Linking';

export type LinkingStackParams = {
  // Tried to get typescript to accept any key from types, but no idea how to do that
  Linking: {
    type: keyof typeof types;
    [key: string]: string;
  };
};

const Stack = createNativeStackNavigator<LinkingStackParams>();

function LinkingStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Linking">
      <Stack.Screen name="Linking" component={Linking} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default LinkingStackNavigator;
