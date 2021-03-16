import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { ParamsScreenNavigationProp } from '..';
import EventEditParams from './EditParams';
import EventParams from './Params';

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
      <Stack.Screen name="Params" component={EventParams} options={{ title: 'Filtres' }} />
      <Stack.Screen
        name="EditParams"
        component={EventEditParams}
        options={{ title: 'Modifier mes filtres' }}
      />
    </Stack.Navigator>
  );
}

export default EventParamsStackNavigator;
