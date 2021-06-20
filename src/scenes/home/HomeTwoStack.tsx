import { CompositeNavigationProp } from '@react-navigation/core';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

import { HomeOneScreenNavigationProp } from './HomeOne';
import ArticleList from './articles/ArticleList';
import EventList from './events/List';
import ListScreen from './list/List';

export type HomeTwoNavParams = {
  Article: { initialList?: string; article?: string } | undefined;
  Event: { initialList?: string; evenement?: string } | undefined;
  List: undefined;
};

export type HomeTwoScreenNavigationProp<K extends keyof HomeTwoNavParams> = CompositeNavigationProp<
  StackNavigationProp<HomeTwoNavParams, K>,
  HomeOneScreenNavigationProp<'Home2'>
>;

const Stack = createStackNavigator<HomeTwoNavParams>();

function HomeTwoNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Article" component={ArticleList} options={{ title: 'Actus' }} />
      <Stack.Screen name="Event" component={EventList} options={{ title: 'Évènements' }} />
      <Stack.Screen name="List" component={ListScreen} options={{ title: 'Plus' }} />
    </Stack.Navigator>
  );
}

export default HomeTwoNavigator;
