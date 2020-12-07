import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MainScreenNavigationProp } from '../Main';
import ArticleHistory from './articles/views/History';
import EventHistory from './events/views/History';
import MainHistory from './main/views/History';

export type HistoryStackParams = {
  Main: undefined;
  Article: undefined;
  Event: undefined;
};

export type HistoryScreenNavigationProp<
  K extends keyof HistoryStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<HistoryStackParams, K>,
  MainScreenNavigationProp<'History'>
>;

const Stack = createNativeStackNavigator<HistoryStackParams>();

function HistoryStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainHistory} />
      <Stack.Screen name="Article" component={ArticleHistory} />
      <Stack.Screen name="Event" component={EventHistory} />
    </Stack.Navigator>
  );
}

export default HistoryStackNavigator;
