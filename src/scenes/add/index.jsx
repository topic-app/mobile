import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PetitionAddStackNavigator from './petitions/index';

const Stack = createStackNavigator();

function AddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" headerMode="none">
      <Stack.Screen name="Petition" component={PetitionAddStackNavigator} />
    </Stack.Navigator>
  );
}

export default AddStackNavigator;
