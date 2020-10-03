import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import LocationDisplay from './views/Display';

const Stack = createNativeStackNavigator();

function LocationDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={LocationDisplay} />
    </Stack.Navigator>
  );
}

export default LocationDisplayStackNavigator;
