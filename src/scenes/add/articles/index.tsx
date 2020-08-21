import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import ArticleAdd from './views/Add';
import ArticleAddSuccess from './views/AddSuccess';
import ArticleAddLocation from './views/AddLocation';

const Stack = createStackNavigator();

function ArticleAddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Add">
      <Stack.Screen
        name="Add"
        component={ArticleAdd}
        options={{
          title: 'Écrire un article',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Success"
        component={ArticleAddSuccess}
        options={{
          title: 'Article ajouté',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Location"
        component={ArticleAddLocation}
        options={{
          title: 'Localisation',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default ArticleAddStackNavigator;
