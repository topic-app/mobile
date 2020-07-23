import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ArticleDisplay from './views/Display';

export type ArticleDisplayStackParams = {
  Display: { id: string; title: string; useLists: boolean };
};

const Stack = createStackNavigator<ArticleDisplayStackParams>();

function ArticleDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" headerMode="none">
      <Stack.Screen name="Display" component={ArticleDisplay} />
    </Stack.Navigator>
  );
}

export default ArticleDisplayStackNavigator;
