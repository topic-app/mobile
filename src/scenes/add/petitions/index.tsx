import React from 'react';

import { createNativeStackNavigator } from '@utils/stack';

import PetitionAdd from './views/Add';

export type PetitionAddStackParams = {
  Add: undefined;
};

const Stack = createNativeStackNavigator<PetitionAddStackParams>();

function PetitionAddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Add">
      <Stack.Screen
        name="Add"
        component={PetitionAdd}
        options={{
          title: 'Créer une pétition',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default PetitionAddStackNavigator;
