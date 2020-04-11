import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ArticleDisplay from './articles/index';
import PetitionDisplay from './petitions/index';
import EventDisplay from './events/index';
import LocationDisplay from './locations/index';
import ImageDisplay from './images/index';

const Stack = createStackNavigator();

function DisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" headerMode="none">
      <Stack.Screen name="Article" component={ArticleDisplay} />
      <Stack.Screen name="Petition" component={PetitionDisplay} />
      <Stack.Screen name="Event" component={EventDisplay} />
      <Stack.Screen name="Location" component={LocationDisplay} />
      <Stack.Screen name="Image" component={ImageDisplay} />
    </Stack.Navigator>
  );
}

export default DisplayStackNavigator;
