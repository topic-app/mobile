import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ArticleConfigureStackNavigator from './articles/index';

const Stack = createStackNavigator();

function ListsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" headerMode="none">
      <Stack.Screen name="Article" component={ArticleConfigureStackNavigator} />
    </Stack.Navigator>
  );
}

export default ListsStackNavigator;
