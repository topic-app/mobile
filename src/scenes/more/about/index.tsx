import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MoreScreenNavigationProp } from '../index';
import AboutLegal from './views/Legal';
import AboutLicenses from './views/Licenses';
import AboutList from './views/List';

export type AboutStackParams = {
  List: {
    page?: 'about' | 'sponsors' | 'licenses';
  };
  Legal: {
    page?: 'mentions' | 'conditions' | 'confidentialite';
  };
  Licenses: {
    page?: 'list' | 'full' | 'logo' | 'illustrations';
  };
};

export type AboutScreenNavigationProp<K extends keyof AboutStackParams> = CompositeNavigationProp<
  NativeStackNavigationProp<AboutStackParams, K>,
  MoreScreenNavigationProp<'About'>
>;

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
