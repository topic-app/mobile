// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CarteListScreen from './pages/List';
import CarteDisplayScreen from './pages/Display';

import { customStyles } from '../../../styles/Styles';

const Stack = createStackNavigator();

function CarteNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="CarteListe"
      screenOptions={customStyles.header}
    >
      <Stack.Screen
        name="CarteListe"
        component={CarteListScreen}
        options={{
          title: 'Carte',
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="CarteArticle"
        component={CarteDisplayScreen}
        options={{
          title: 'Carte:  Display',
        }}
      />
    </Stack.Navigator>
  );
}

export default CarteNavigator;
