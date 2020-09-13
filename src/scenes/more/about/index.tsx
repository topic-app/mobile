import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HeaderConfig } from '@components/Header';

import AboutList from './views/List';
import AboutLegal from './views/Legal';
import AboutLicenses from './views/Licenses';

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
      <Stack.Screen
        name="Legal"
        component={AboutLegal}
        options={{
          ...HeaderConfig,
          title: 'Légal',
        }}
      />
      <Stack.Screen
        name="Licenses"
        component={AboutLicenses}
        options={{
          ...HeaderConfig,
          title: 'Licenses',
        }}
      />
    </Stack.Navigator>
  );
}

export default AboutStackNavigator;
