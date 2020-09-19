import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import ArticleConfigure from './views/Configure';

const Stack = createStackNavigator();

function EventListsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Configure">
      <Stack.Screen
        name="Configure"
        component={ArticleConfigure}
        options={({ route }) => ({
          ...HeaderConfig,
          title: 'Événements',
          subtitle: 'Configurer',
        })}
      />
    </Stack.Navigator>
  );
}

export default EventListsStackNavigator;
