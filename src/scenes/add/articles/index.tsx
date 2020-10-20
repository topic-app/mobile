import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import { HeaderConfig } from '@components/Header';
import ArticleAdd from './views/Add';
import ArticleAddSuccess from './views/AddSuccess';
import ArticleAddLocation from './views/AddLocation';
import ArticleAddContent from './views/AddContent';

const Stack = createNativeStackNavigator();

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
        name="AddContent"
        component={ArticleAddContent}
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
          ...HeaderConfig,
          title: 'Localisation',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default ArticleAddStackNavigator;
