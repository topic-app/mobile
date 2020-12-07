import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MainScreenNavigationProp } from '../Main';
import ArticleAddStackNavigator, { ArticleAddStackParams } from './articles/index';
import EventAddStackNavigator, { EventAddStackParams } from './events/index';
import GroupAddStackNavigator, { GroupAddStackParams } from './groups/index';
import PetitionAddStackNavigator, { PetitionAddStackParams } from './petitions/index';

export type AddStackParams = {
  Article: NavigatorScreenParams<ArticleAddStackParams>;
  Event: NavigatorScreenParams<EventAddStackParams>;
  Group: NavigatorScreenParams<GroupAddStackParams>;
  Petition: NavigatorScreenParams<PetitionAddStackParams>;
};

export type AddScreenNavigationProp<K extends keyof AddStackParams> = CompositeNavigationProp<
  NativeStackNavigationProp<AddStackParams, K>,
  MainScreenNavigationProp<'Add'>
>;

const Stack = createNativeStackNavigator<AddStackParams>();

function AddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Article" component={ArticleAddStackNavigator} />
      <Stack.Screen name="Event" component={EventAddStackNavigator} />
      <Stack.Screen name="Group" component={GroupAddStackNavigator} />
      <Stack.Screen name="Petition" component={PetitionAddStackNavigator} />
    </Stack.Navigator>
  );
}

export default AddStackNavigator;
