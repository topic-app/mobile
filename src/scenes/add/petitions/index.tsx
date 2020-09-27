import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { HeaderConfig } from '@components/Header';
import PetitionAdd from './views/Add';

const Stack = createNativeStackNavigator();

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
