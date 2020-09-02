import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { HeaderConfig } from '@components/Header';

import AboutList from './views/List';
import AboutLegal from './views/Legal';
import AboutLicenses from './views/Licenses';

export type AboutStackParams = {
  List: undefined;
  Legal: {
    page?: 'list' | 'full' | 'logo' | 'illustrations';
  };
  Licenses: {
    page?: 'list' | 'full' | 'logo' | 'illustrations';
  };
};

const Stack = createNativeStackNavigator<AboutStackParams>();

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
