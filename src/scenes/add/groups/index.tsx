import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import { HeaderConfig } from '@components/Header';
import ArticleAdd from './views/Add';
import GroupAddSuccess from './views/AddSuccess';
import GroupAddLocation from './views/AddLocation';

const Stack = createNativeStackNavigator();

function ArticleAddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Add">
      <Stack.Screen
        name="Add"
        component={ArticleAdd}
        options={{
          title: 'Créer un groupe',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Success"
        component={GroupAddSuccess}
        options={{
          title: 'Groupe ajouté',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Location"
        component={GroupAddLocation}
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
