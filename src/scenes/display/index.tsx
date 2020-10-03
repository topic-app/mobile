import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import ArticleDisplayStackNavigator from './articles/index';
import PetitionDisplayStackNavigator from './petitions/index';
import EventDisplayStackNavigator from './events/index';
import LocationDisplayStackNavigator from './locations/index';
import ImageDisplayStackNavigator from './images/index';
import UserDisplayStackNavigator from './users/index';
import GroupDisplayStackNavigator from './groups/index';

const Stack = createNativeStackNavigator();

function DisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Article" component={ArticleDisplayStackNavigator} />
      <Stack.Screen name="Petition" component={PetitionDisplayStackNavigator} />
      <Stack.Screen name="Event" component={EventDisplayStackNavigator} />
      <Stack.Screen name="Location" component={LocationDisplayStackNavigator} />
      <Stack.Screen name="Image" component={ImageDisplayStackNavigator} />
      <Stack.Screen name="User" component={UserDisplayStackNavigator} />
      <Stack.Screen name="Group" component={GroupDisplayStackNavigator} />
    </Stack.Navigator>
  );
}

export default DisplayStackNavigator;
