import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { ConfigureScreenNavigationProp } from '../index';
import EventConfigure from './views/Configure';

export type EventConfigureStackParams = {
  Configure: undefined;
};

export type EventConfigureScreenNavigationProp<
  K extends keyof EventConfigureStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<EventConfigureStackParams, K>,
  ConfigureScreenNavigationProp<'Event'>
>;

const Stack = createNativeStackNavigator<EventConfigureStackParams>();

function EventConfigureStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Configure" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Configure"
        options={{ title: 'Configurer mon feed' }}
        component={EventConfigure}
      />
    </Stack.Navigator>
  );
}

export default EventConfigureStackNavigator;
