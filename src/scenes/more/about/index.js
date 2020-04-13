import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AboutList from './views/List';

import { HeaderConfig } from '../../../components/Header';

const Stack = createStackNavigator();

function AboutStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen
        name="List"
        component={AboutList}
        options={{
          ...HeaderConfig,
          title: 'A Propos',
        }}
      />
    </Stack.Navigator>
  );
}

export default AboutStackNavigator;
