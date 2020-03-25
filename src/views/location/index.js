// eslint-disable-next-line no-unused-vars
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LocationMapScreen from './pages/Map';
import LocationSearchScreen from './pages/Search';

const Stack = createStackNavigator();

function LocationNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Map"
    >
      <Stack.Screen
        name="Map"
        component={LocationMapScreen}
        options={{
          title: 'Recherche d\'établissement',
        }}
      />
      <Stack.Screen
        name="Search"
        component={LocationSearchScreen}
        options={{
          title: 'Recherche d\'établissement',
        }}
      />
    </Stack.Navigator>
  );
}

export default LocationNavigator;
