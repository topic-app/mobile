import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { ConfigureScreenNavigationProp } from '..';
import ArticleConfigure from './Configure';

export type ArticleConfigureStackParams = {
  Configure: undefined;
};

export type ArticleConfigureScreenNavigationProp<
  K extends keyof ArticleConfigureStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<ArticleConfigureStackParams, K>,
  ConfigureScreenNavigationProp<'Article'>
>;

const Stack = createNativeStackNavigator<ArticleConfigureStackParams>();

function ArticleConfigureStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Configure" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Configure"
        options={{ title: 'Configurer mon feed' }}
        component={ArticleConfigure}
      />
    </Stack.Navigator>
  );
}

export default ArticleConfigureStackNavigator;
