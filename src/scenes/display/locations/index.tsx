import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LocationDisplay from './views/Display';

const Stack = createStackNavigator();

function LocationDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" headerMode="none">
      <Stack.Screen name="Display" component={LocationDisplay} />
    </Stack.Navigator>
  );
}

export default LocationDisplayStackNavigator;
