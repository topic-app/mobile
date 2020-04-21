import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import UserArticles from './content/views/Articles';
import UserPetitions from './content/views/Petitions';
import UserEvents from './content/views/Events';
import UserLocations from './content/views/Locations';

const Stack = createStackNavigator();

function UserContentStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article">
      <Stack.Screen name="Article" component={UserArticles} />
      <Stack.Screen name="Petition" component={UserPetitions} />
      <Stack.Screen name="Event" component={UserEvents} />
      <Stack.Screen name="Location" component={UserLocations} />
    </Stack.Navigator>
  );
}

export default UserContentStackNavigator;