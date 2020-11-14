import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import ArticleHistory from './views/History';

export type ArticleHistoryStackParams = {
  Params: undefined;
};

const Stack = createNativeStackNavigator<ArticleHistoryStackParams>();

function ArticleHistoryStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Params" component={ArticleHistory} />
    </Stack.Navigator>
  );
}

export default ArticleHistoryStackNavigator;
