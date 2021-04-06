import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { ParamsScreenNavigationProp } from '..';
import ArticleEditParams from './EditParams';
import ArticleParams from './Params';

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
      <Stack.Screen name="Params" component={ArticleParams} options={{ title: 'Filtres' }} />
      <Stack.Screen
        name="EditParams"
        component={ArticleEditParams}
        options={{ title: 'Modifier mes filtres' }}
      />
    </Stack.Navigator>
  );
}

export default ArticleParamsStackNavigator;
