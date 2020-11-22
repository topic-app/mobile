import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import ArticleConfigure from './views/Configure';

export type EventListsStackParams = {
  Configure: undefined;
};

const Stack = createNativeStackNavigator<EventListsStackParams>();

function EventListsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Configure" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Configure" component={ArticleConfigure} />
    </Stack.Navigator>
  );
}

export default EventListsStackNavigator;
