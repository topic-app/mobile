import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { ModerationTypes } from '@ts/types';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MoreScreenNavigationProp } from '../index';
import ModerationList from './views/List';

export type ModerationStackParams = {
  List: { type: ModerationTypes };
};

export type ModerationScreenNavigationProp<
  K extends keyof ModerationStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<ModerationStackParams, K>,
  MoreScreenNavigationProp<'Moderation'>
>;

const Stack = createNativeStackNavigator<ModerationStackParams>();

function ModerationStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="List" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="List" component={ModerationList} />
    </Stack.Navigator>
  );
}

export default ModerationStackNavigator;
