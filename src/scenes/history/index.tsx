import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import ArticleHistoryStackNavigator from './articles/index';
import EventHistoryStackNavigator from './events/index';
import MainHistoryStackNavigator from './main/index';

const Stack = createNativeStackNavigator();

function HistoryStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainHistoryStackNavigator} />
      <Stack.Screen name="Article" component={ArticleHistoryStackNavigator} />
      <Stack.Screen name="Event" component={EventHistoryStackNavigator} />
    </Stack.Navigator>
  );
}

export default HistoryStackNavigator;
