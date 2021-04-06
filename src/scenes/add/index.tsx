import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { MainScreenNavigationProp } from '../Main';
import ArticleAddStackNavigator, { ArticleAddStackParams } from './articles/index';
import EventAddStackNavigator, { EventAddStackParams } from './events/index';
import GroupAddStackNavigator, { GroupAddStackParams } from './groups/index';

export type AddStackParams = {
  Article: NavigatorScreenParams<ArticleAddStackParams>;
  Event: NavigatorScreenParams<EventAddStackParams>;
  Group: NavigatorScreenParams<GroupAddStackParams>;
};

export type AddScreenNavigationProp<K extends keyof AddStackParams> = CompositeNavigationProp<
  NativeStackNavigationProp<AddStackParams, K>,
  MainScreenNavigationProp<'Add'>
>;

const Stack = createNativeStackNavigator<AddStackParams>();

function AddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Article"
        options={{ title: 'Articles' }}
        component={ArticleAddStackNavigator}
      />
      <Stack.Screen
        name="Event"
        options={{ title: 'Évènements' }}
        component={EventAddStackNavigator}
      />
      <Stack.Screen
        name="Group"
        options={{ title: 'Groupes' }}
        component={GroupAddStackNavigator}
      />
    </Stack.Navigator>
  );
}

export default AddStackNavigator;
