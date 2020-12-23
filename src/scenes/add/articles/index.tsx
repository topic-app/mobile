import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { ArticleCreationData, ReduxLocation } from '@ts/redux';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { AddScreenNavigationProp } from '..';
import ArticleAdd from './views/Add';
import ArticleAddContent from './views/AddContent';
import ArticleAddSuccess from './views/AddSuccess';

export type ArticleAddStackParams = {
  Add: undefined;
  AddContent: undefined;
  Success: {
    id?: string;
    creationData?: ArticleCreationData;
  };
  Location: {
    hideSearch: boolean;
    type: 'schools' | 'departements' | 'regions' | 'other';
    initialData?: ReduxLocation;
    callback: (location: ReduxLocation) => any;
  };
};

export type ArticleAddScreenNavigationProp<
  K extends keyof ArticleAddStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<ArticleAddStackParams, K>,
  AddScreenNavigationProp<'Article'>
>;

const Stack = createNativeStackNavigator<ArticleAddStackParams>();

function ArticleAddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Add" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Add" component={ArticleAdd} />
      <Stack.Screen name="AddContent" component={ArticleAddContent} />
      <Stack.Screen name="Success" component={ArticleAddSuccess} />
    </Stack.Navigator>
  );
}

export default ArticleAddStackNavigator;
