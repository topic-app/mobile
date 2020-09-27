import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import ArticleParams from './views/Params';
import ArticleEditParams from './views/EditParams';

const Stack = createStackNavigator();

function ArticleConfigureStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params">
      <Stack.Screen
        name="Params"
        component={ArticleParams}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Localisation',
          subtitle: 'Articles',
        })}
      />
      <Stack.Screen
        name="EditParams"
        component={ArticleEditParams}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Localisation',
          subtitle: 'Articles',
        })}
      />
    </Stack.Navigator>
  );
}

export default ArticleConfigureStackNavigator;
