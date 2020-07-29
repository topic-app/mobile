import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ArticleList from './articles/views/List';
import PetitionList from './petitions/views/List';
import EventList from './events/views/List';
import ExplorerList from './explorer/views/List';

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

const Stack = createStackNavigator<HomeTwoNavParams>();

function HomeTwoNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Article"
      screenOptions={({ route }) => {
        if (route.params && getNestedParams(route)?.noTransition) {
          return {
            cardStyleInterpolator: () => ({ cardStyle: null }),
          };
        }
        return {};
      }}
    >
      <Stack.Screen name="Article" component={ArticleList} />
      <Stack.Screen name="Event" component={EventList} />
      {/* <Stack.Screen name="Petition" component={PetitionList} /> */}
      <Stack.Screen name="Explorer" component={ExplorerList} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default HomeTwoNavigator;
