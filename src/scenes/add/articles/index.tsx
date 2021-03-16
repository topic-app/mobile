import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { ArticleCreationData } from '@ts/redux';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { AddScreenNavigationProp } from '..';
import ArticleAdd from './Add';
import ArticleAddContent from './AddContent';
import ArticleAddSuccess from './AddSuccess';

export type ArticleAddStackParams = {
  Add: undefined;
  AddContent: undefined;
  Success: {
    id?: string;
    creationData?: ArticleCreationData;
    editing?: boolean;
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
      <Stack.Screen name="Add" options={{ title: 'Écrire un article' }} component={ArticleAdd} />
      <Stack.Screen
        name="AddContent"
        options={{ title: 'Écrire un article' }}
        component={ArticleAddContent}
      />
      <Stack.Screen
        name="Success"
        options={{ title: 'Écrire un article' }}
        component={ArticleAddSuccess}
      />
    </Stack.Navigator>
  );
}

export default ArticleAddStackNavigator;
