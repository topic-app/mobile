import React from 'react';

import UnauthorizedBeta from '@components/UnauthorizedBeta';
import { createNativeStackNavigator } from '@utils/stack';

import ArticleList from './articles/views/List';
import EventList from './events/views/List';

// import ExplorerList from './explorer/views/List';

function getNestedParams(route: { params?: any }) {
  let { params } = route;
  while (params.params) {
    params = params.params;
  }
  return params;
}

export type HomeTwoNavParams = {
  Article: { initialList: string };
  Event: undefined;
  Petition: undefined;
  Explorer: undefined;
};

const Stack = createNativeStackNavigator<HomeTwoNavParams>();

function HomeTwoNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Article"
      screenOptions={{ headerShown: false, animationEnabled: false }}
    >
      <Stack.Screen name="Article" component={ArticleList} />
      <Stack.Screen name="Event" component={EventList} />
      {/* <Stack.Screen name="Petition" component={PetitionList} /> */}
      <Stack.Screen name="Explorer" component={UnauthorizedBeta} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default HomeTwoNavigator;
