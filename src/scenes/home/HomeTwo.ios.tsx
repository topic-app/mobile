import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { HomeOneScreenNavigationProp } from './HomeOne';
import ArticleList from './articles/views/List';
import EventList from './events/views/List';
import ExplorerList from './explorer/views/List';

export type HomeTwoNavParams = {
  Article: { initialList: string } | undefined;
  Event: { initialList?: string } | undefined;
  Petition: undefined;
  Explorer: undefined;
};

export type HomeTwoScreenNavigationProp<K extends keyof HomeTwoNavParams> = CompositeNavigationProp<
  NativeStackNavigationProp<HomeTwoNavParams, K>,
  HomeOneScreenNavigationProp<'Home2'>
>;

const Stack = createNativeStackNavigator<HomeTwoNavParams>();

function HomeTwoNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Article" component={ArticleList} />
      <Stack.Screen name="Event" component={EventList} />
      {/* <Stack.Screen name="Petition" component={PetitionList} /> */}
      <Stack.Screen name="Explorer" component={ExplorerList} />
    </Stack.Navigator>
  );
}

export default HomeTwoNavigator;
