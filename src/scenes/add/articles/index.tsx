import React from 'react';

import { HeaderConfig } from '@components/Header';
import { ArticleCreationData, ReduxLocation } from '@ts/redux';
import { createNativeStackNavigator } from '@utils/stack';

import ArticleAdd from './views/Add';
import ArticleAddContent from './views/AddContent';
import ArticleAddLocation from './views/AddLocation';
import ArticleAddSuccess from './views/AddSuccess';

export type ArticleAddStackParams = {
  Add: undefined;
  AddContent: undefined;
  Success: {
    id?: string;
    creationData?: ArticleCreationData;
  };
  Location: {
    hideSearch: boolean;
    type: 'schools' | 'departements' | 'regions' | 'other';
    initialData?: ReduxLocation;
    callback: (location: ReduxLocation) => any;
  };
};

const Stack = createNativeStackNavigator<ArticleAddStackParams>();

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
