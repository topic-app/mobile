import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

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
    <Stack.Navigator initialRouteName="List" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="List" component={AboutList} />
      <Stack.Screen name="Legal" component={AboutLegal} />
      <Stack.Screen name="Licenses" component={AboutLicenses} />
    </Stack.Navigator>
  );
}

export default AboutStackNavigator;
