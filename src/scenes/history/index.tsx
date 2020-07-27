import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ArticleHistoryStackNavigator from './articles/index';
import MainHistoryStackNavigator from './main/index';

const Stack = createStackNavigator();

function HistoryStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" headerMode="none">
      <Stack.Screen name="Main" component={MainHistoryStackNavigator} />

      <Stack.Screen name="Article" component={ArticleHistoryStackNavigator} />
    </Stack.Navigator>
  );
}

export default HistoryStackNavigator;
