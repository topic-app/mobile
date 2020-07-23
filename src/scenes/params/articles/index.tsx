import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import ArticleParams from './views/Params';

const Stack = createStackNavigator();

function ArticleConfigureStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params">
      <Stack.Screen
        name="Params"
        component={ArticleParams}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Actus',
          subtitle: 'Localisation',
        })}
      />
    </Stack.Navigator>
  );
}

export default ArticleConfigureStackNavigator;
