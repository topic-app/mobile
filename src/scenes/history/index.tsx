import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ArticleHistoryStackNavigator from './articles/index';
import EventHistoryStackNavigator from './events/index';
import MainHistoryStackNavigator from './main/index';

const Stack = createStackNavigator();

function HistoryStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main" headerMode="none">
      <Stack.Screen name="Main" component={MainHistoryStackNavigator} />

      <Stack.Screen name="Article" component={ArticleHistoryStackNavigator} />
      <Stack.Screen name="Event" component={EventHistoryStackNavigator} />
    </Stack.Navigator>
  );
}

export default HistoryStackNavigator;
