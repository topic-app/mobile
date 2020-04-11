import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PetitionDisplay from './views/Display';

const Stack = createStackNavigator();

function PetitionDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" headerMode="none">
      <Stack.Screen name="Display" component={PetitionDisplay} />
    </Stack.Navigator>
  );
}

export default PetitionDisplayStackNavigator;
