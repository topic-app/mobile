import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ArticleListsStackNavigator from './articles/index';

const Stack = createStackNavigator();

function ListsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" headerMode="none">
      <Stack.Screen name="Article" component={ArticleListsStackNavigator} />
    </Stack.Navigator>
  );
}

export default ListsStackNavigator;
