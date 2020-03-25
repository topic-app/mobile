// eslint-disable-next-line
import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ActuListScreen from './pages/List';
import ActuDisplayScreen from './pages/Display';

import { customStyles } from '../../../styles/Styles';

const Stack = createStackNavigator();

function ActuNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ActuListe"
      screenOptions={customStyles.header}
    >
      <Stack.Screen
        name="ActuListe"
        component={ActuListScreen}
        options={{
          title: 'Actus et évènements',
        }}
      />
      <Stack.Screen
        name="ActuArticle"
        component={ActuDisplayScreen}
        options={{
          title: 'Actus et évènements',
        }}
      />
    </Stack.Navigator>
  );
}

export default ActuNavigator;
