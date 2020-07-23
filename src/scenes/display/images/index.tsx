import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ImageDisplay from './views/Display';

const Stack = createStackNavigator();

function ImageDisplayStackNavigator() {
  // Make sure this is a modal!
  return (
    <Stack.Navigator mode="modal" initialRouteName="Display" headerMode="none">
      <Stack.Screen name="Display" component={ImageDisplay} />
    </Stack.Navigator>
  );
}

export default ImageDisplayStackNavigator;
