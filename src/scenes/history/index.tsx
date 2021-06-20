import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { MainScreenNavigationProp } from '../Main';
import ArticleHistory from './ArticleHistory';
import EventHistory from './EventHistory';
import MainHistory from './MainHistory';

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
      <Stack.Screen name="Main" component={MainHistory} options={{ title: 'Historique' }} />
      <Stack.Screen name="Article" component={ArticleHistory} options={{ title: 'Historique' }} />
      <Stack.Screen name="Event" component={EventHistory} options={{ title: 'Historique' }} />
    </Stack.Navigator>
  );
}

export default HistoryStackNavigator;
