import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import ArticleList from './articles/views/List';
import EventList from './events/views/List';
import ExplorerList from './explorer/views/List';
import UnauthorizedBeta from '@components/UnauthorizedBeta';

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
      screenOptions={({ route }) => {
        if (route.params && getNestedParams(route)?.noTransition) {
          return {
            cardStyleInterpolator: () => ({ cardStyle: null }),
            headerShown: false,
          };
        }
        return { headerShown: false };
      }}
    >
      <Stack.Screen name="Article" component={ArticleList} />
      <Stack.Screen name="Event" component={UnauthorizedBeta} />
      {/* <Stack.Screen name="Petition" component={PetitionList} /> */}
      <Stack.Screen name="Explorer" component={UnauthorizedBeta} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default HomeTwoNavigator;
