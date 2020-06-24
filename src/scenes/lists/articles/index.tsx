import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import ArticleLists from './views/Lists';

const Stack = createStackNavigator();

function ArticleListsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Lists">
      <Stack.Screen
        name="Lists"
        component={ArticleLists}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Actus',
          subtitle: 'Listes',
        })}
      />
    </Stack.Navigator>
  );
}

export default ArticleListsStackNavigator;
