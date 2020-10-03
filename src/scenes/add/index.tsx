import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import PetitionAddStackNavigator from './petitions/index';
import EventAddStackNavigator from './events/index';
import ArticleAddStackNavigator from './articles/index';

const Stack = createNativeStackNavigator();

function AddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Article" component={ArticleAddStackNavigator} />
      <Stack.Screen name="Event" component={EventAddStackNavigator} />
      <Stack.Screen name="Petition" component={PetitionAddStackNavigator} />
    </Stack.Navigator>
  );
}

export default AddStackNavigator;
