import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import { MainStackParams } from '../Main';
import ArticleDisplayStackNavigator from './articles/index';
import EventDisplayStackNavigator from './events/index';
import GroupDisplayStackNavigator from './groups/index';
import ImageDisplayStackNavigator from './images/index';
import LocationDisplayStackNavigator from './locations/index';
import PetitionDisplayStackNavigator from './petitions/index';
import UserDisplayStackNavigator, { UserDisplayStackParams } from './users/index';

const Stack = createNativeStackNavigator();

export type DisplayStackParams = {
  Article: undefined;
  Petition: undefined;
  Event: undefined;
  Location: undefined;
  Image: undefined;
  User: {
    screen: keyof UserDisplayStackParams;
    params: UserDisplayStackParams[keyof UserDisplayStackParams];
  };
  Group: undefined;
} & MainStackParams;

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
