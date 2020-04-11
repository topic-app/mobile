import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import EventDisplay from './views/Display';
import EventProgram from './views/Program';

const Stack = createStackNavigator();

function EventDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" headerMode="none">
      <Stack.Screen name="Display" component={EventDisplay} />
      <Stack.Screen name="Program" component={EventProgram} />
    </Stack.Navigator>
  );
}

export default EventDisplayStackNavigator;
