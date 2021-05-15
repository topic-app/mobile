import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { MainScreenNavigationProp } from '../Main';
import ArticleConfigureStackNavigator, { ArticleConfigureStackParams } from './articles/index';
import EventConfigureStackNavigator, { EventConfigureStackParams } from './events/index';

export type ConfigureStackParams = {
  Article: NavigatorScreenParams<ArticleConfigureStackParams>;
  Event: NavigatorScreenParams<EventConfigureStackParams>;
};

export type ConfigureScreenNavigationProp<
  K extends keyof ConfigureStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<ConfigureStackParams, K>,
  MainScreenNavigationProp<'Configure'>
>;

const Stack = createNativeStackNavigator<ConfigureStackParams>();

function ListsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Article" component={ArticleConfigureStackNavigator} />
      <Stack.Screen name="Event" component={EventConfigureStackNavigator} />
    </Stack.Navigator>
  );
}

export default ListsStackNavigator;
