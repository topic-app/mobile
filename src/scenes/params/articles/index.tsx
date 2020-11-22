import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import ArticleParams from './views/Params';
import ArticleEditParams from './views/EditParams';

export type ArticleConfigureStackParams = {
  Params: undefined;
  EditParams: {
    type: 'schools' | 'departements' | 'regions' | 'other';
    hideSearch: boolean;
  };
};

const Stack = createNativeStackNavigator<ArticleConfigureStackParams>();

function ArticleConfigureStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Params" component={ArticleParams} />
      <Stack.Screen name="EditParams" component={ArticleEditParams} />
    </Stack.Navigator>
  );
}

export default ArticleConfigureStackNavigator;
