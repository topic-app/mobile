import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import ArticleHistory from './views/History';

const Stack = createStackNavigator();

function ArticleHistoryStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Params">
      <Stack.Screen
        name="Params"
        component={ArticleHistory}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Actus',
          subtitle: 'Historique',
        })}
      />
    </Stack.Navigator>
  );
}

export default ArticleHistoryStackNavigator;
