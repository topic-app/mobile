import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { ParamsScreenNavigationProp } from '../index';
import EventEditParams from './views/EditParams';
import EventParams from './views/Params';

export type EventParamsStackParams = {
  Params: undefined;
  EditParams: {
    type: 'schools' | 'departements' | 'regions' | 'other';
    hideSearch: boolean;
  };
};

export type EventParamsScreenNavigationProp<
  K extends keyof EventParamsStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<EventParamsStackParams, K>,
  ParamsScreenNavigationProp<'Event'>
>;

const Stack = createNativeStackNavigator<EventParamsStackParams>();

function EventParamsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Params" component={EventParams} />
      <Stack.Screen name="EditParams" component={EventEditParams} />
    </Stack.Navigator>
  );
}

export default EventParamsStackNavigator;
