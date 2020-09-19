import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PetitionAddStackNavigator from './petitions/index';
import EventAddStackNavigator from './events/index';
import ArticleAddStackNavigator from './articles/index';

const Stack = createStackNavigator();

function AddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" headerMode="none">
      <Stack.Screen name="Article" component={ArticleAddStackNavigator} />
      <Stack.Screen name="Event" component={EventAddStackNavigator} />
      <Stack.Screen name="Petition" component={PetitionAddStackNavigator} />
    </Stack.Navigator>
  );
}

export default AddStackNavigator;
