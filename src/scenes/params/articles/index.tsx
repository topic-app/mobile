import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { HeaderConfig } from '@components/Header';
import ArticleParams from './views/Params';
import ArticleEditParams from './views/EditParams';

const Stack = createNativeStackNavigator();

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
      <Stack.Screen
        name="EditParams"
        component={ArticleEditParams}
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
