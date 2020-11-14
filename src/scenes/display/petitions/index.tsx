import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import PetitionDisplay from './views/Display';

export type PetitionDisplayStackParams = {
  Display: { id: string };
};

const Stack = createNativeStackNavigator();

function PetitionDisplayStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Display" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Display" component={PetitionDisplay} />
    </Stack.Navigator>
  );
}

export default PetitionDisplayStackNavigator;
