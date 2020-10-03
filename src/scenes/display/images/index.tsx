import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

import ImageDisplay from './views/Display';

const Stack = createNativeStackNavigator();

function ImageDisplayStackNavigator() {
  // Make sure this is a modal!
  return (
    <Stack.Navigator mode="modal" initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={ImageDisplay} />
    </Stack.Navigator>
  );
}

export default ImageDisplayStackNavigator;
