import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MainScreenNavigationProp } from '../Main';
import ArticleParamsStackNavigator, { ArticleParamsStackParams } from './articles/index';
import EventParamsStackNavigator, { EventParamsStackParams } from './events/index';

export type ParamsStackParams = {
  Article: NavigatorScreenParams<ArticleParamsStackParams>;
  Event: NavigatorScreenParams<EventParamsStackParams>;
};

export type ParamsScreenNavigationProp<K extends keyof ParamsStackParams> = CompositeNavigationProp<
  NativeStackNavigationProp<ParamsStackParams, K>,
  MainScreenNavigationProp<'Params'>
>;

const Stack = createNativeStackNavigator<ParamsStackParams>();

function ParamsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Article" component={ArticleParamsStackNavigator} />
      <Stack.Screen name="Event" component={EventParamsStackNavigator} />
    </Stack.Navigator>
  );
}

export default ParamsStackNavigator;
