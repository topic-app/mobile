import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ArticleList from './articles/views/List';
import PetitionList from './petitions/views/List';
import EventList from './events/views/List';
import ExplorerList from './explorer/views/List';

import { HeaderConfig } from '../../components/Header';

const Stack = createStackNavigator();

function HomeTwoNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article">
      <Stack.Screen
        name="Article"
        component={ArticleList}
        options={{ ...HeaderConfig, title: 'Actualités' }}
      />
      <Stack.Screen
        name="Event"
        component={PetitionList}
        options={{ ...HeaderConfig, title: 'Evènements' }}
      />
      <Stack.Screen
        name="Petition"
        component={EventList}
        options={{ ...HeaderConfig, title: 'Pétitions' }}
      />
      <Stack.Screen name="Explorer" component={ExplorerList} options={{ title: '' }} />
    </Stack.Navigator>
  );
}

export default HomeTwoNavigator;
