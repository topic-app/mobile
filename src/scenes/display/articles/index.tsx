import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import ArticleDisplay from './views/Display';

export type ArticleDisplayStackParams = {
  Display: { id: string; title: string; useLists: boolean; verification: boolean };
};

const Stack = createNativeStackNavigator<ArticleDisplayStackParams>();

function ArticleDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={ArticleDisplay} />
    </Stack.Navigator>
  );
}

export default ArticleDisplayStackNavigator;
