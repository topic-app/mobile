import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { ParamsScreenNavigationProp } from '../index';
import ArticleEditParams from './views/EditParams';
import ArticleParams from './views/Params';

export type ArticleParamsStackParams = {
  Params: undefined;
  EditParams: {
    type: 'schools' | 'departements' | 'regions' | 'other';
    hideSearch: boolean;
  };
};

export type ArticleParamsScreenNavigationProp<
  K extends keyof ArticleParamsStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<ArticleParamsStackParams, K>,
  ParamsScreenNavigationProp<'Article'>
>;

const Stack = createNativeStackNavigator<ArticleParamsStackParams>();

function ArticleParamsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Params" component={ArticleParams} />
      <Stack.Screen name="EditParams" component={ArticleEditParams} />
    </Stack.Navigator>
  );
}

export default ArticleParamsStackNavigator;
