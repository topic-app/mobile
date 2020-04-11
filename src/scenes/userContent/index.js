import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MyArticles from './articles/views/MyArticles';
import MyPetitions from './petitions/views/MyPetitions';
import MyEvents from './events/views/MyEvents';
import MyLocations from './locations/views/MyLocations';

const Stack = createStackNavigator();

function UserContentStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article">
      <Stack.Screen name="Article" component={MyArticles} />
      <Stack.Screen name="Petition" component={MyPetitions} />
      <Stack.Screen name="Event" component={MyEvents} />
      <Stack.Screen name="Location" component={MyLocations} />
    </Stack.Navigator>
  );
}

export default UserContentStackNavigator;
