import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { DisplayScreenNavigationProp } from '..';
import ArticleDisplay from './Display';

export type ArticleDisplayStackParams = {
  Display: { id: string; verification: boolean };
};

export type ArticleDisplayScreenNavigationProp<
  K extends keyof ArticleDisplayStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<ArticleDisplayStackParams, K>,
  DisplayScreenNavigationProp<'Article'>
>;

const Stack = createNativeStackNavigator<ArticleDisplayStackParams>();

function ArticleDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={ArticleDisplay} />
    </Stack.Navigator>
  );
}

export default ArticleDisplayStackNavigator;
