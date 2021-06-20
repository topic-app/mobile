import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { MainScreenNavigationProp } from '../Main';
import ArticleDisplayStackNavigator, { ArticleDisplayStackParams } from './articles/index';
import EventDisplayStackNavigator, { EventDisplayStackParams } from './events/index';
import GroupDisplayStackNavigator, { GroupDisplayStackParams } from './groups/index';
import ImageDisplayStackNavigator, { ImageDisplayStackParams } from './images/index';
import LocationDisplayStackNavigator, { LocationDisplayStackParams } from './locations/index';
import UserDisplayStackNavigator, { UserDisplayStackParams } from './users/index';

export type DisplayStackParams = {
  Article: NavigatorScreenParams<ArticleDisplayStackParams>;
  Event: NavigatorScreenParams<EventDisplayStackParams>;
  Location: NavigatorScreenParams<LocationDisplayStackParams>;
  Image: NavigatorScreenParams<ImageDisplayStackParams>;
  User: NavigatorScreenParams<UserDisplayStackParams>;
  Group: NavigatorScreenParams<GroupDisplayStackParams>;
};

export type DisplayScreenNavigationProp<
  K extends keyof DisplayStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<DisplayStackParams, K>,
  MainScreenNavigationProp<'Display'>
>;

const Stack = createNativeStackNavigator<DisplayStackParams>();

function DisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Article" component={ArticleDisplayStackNavigator} />
      <Stack.Screen name="Event" component={EventDisplayStackNavigator} />
      <Stack.Screen name="Location" component={LocationDisplayStackNavigator} />
      <Stack.Screen name="Image" component={ImageDisplayStackNavigator} />
      <Stack.Screen name="User" component={UserDisplayStackNavigator} />
      <Stack.Screen name="Group" component={GroupDisplayStackNavigator} />
    </Stack.Navigator>
  );
}

export default DisplayStackNavigator;
