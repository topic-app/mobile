// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PetitionListScreen from './pages/List';
import PetitionDisplayScreen from './pages/Display';

import { customStyles } from '../../../styles/Styles';

const Stack = createStackNavigator();

function PetitionNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="PetitionListe"
      screenOptions={customStyles.header}
    >
      <Stack.Screen
        name="PetitionListe"
        component={PetitionListScreen}
        options={{
          title: 'Pétitions',
        }}
      />
      <Stack.Screen
        name="PetitionArticle"
        component={PetitionDisplayScreen}
        options={{
          title: 'Petitions: Display',
        }}
      />
    </Stack.Navigator>
  );
}

export default PetitionNavigator;
