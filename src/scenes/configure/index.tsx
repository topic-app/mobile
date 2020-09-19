import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ArticleConfigureStackNavigator from './articles/index';
import EventConfigureStackNavigator from './events/index';

const Stack = createStackNavigator();

function ListsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" headerMode="none">
      <Stack.Screen name="Article" component={ArticleConfigureStackNavigator} />
      <Stack.Screen name="Event" component={EventConfigureStackNavigator} />
    </Stack.Navigator>
  );
}

export default ListsStackNavigator;
