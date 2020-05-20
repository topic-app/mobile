import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';
import PetitionAdd from './views/Add';

const Stack = createStackNavigator();

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
