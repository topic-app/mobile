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
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}

export default EventListsStackNavigator;
