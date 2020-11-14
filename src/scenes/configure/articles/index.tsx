import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import ArticleConfigure from './views/Configure';

export type ArticleListsStackParams = {
  Configure: undefined;
};

const Stack = createNativeStackNavigator<ArticleListsStackParams>();

function ArticleListsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Configure" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Configure" component={ArticleConfigure} />
    </Stack.Navigator>
  );
}

export default ArticleListsStackNavigator;
