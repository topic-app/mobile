import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import { MoreScreenNavigationProp } from '../index';
import AboutLegal from './Legal';
import AboutLicenses from './Licenses';
import AboutList from './List';

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
      <Stack.Screen name="List" component={AboutList} options={{ title: 'À propos' }} />
      <Stack.Screen name="Legal" component={AboutLegal} options={{ title: 'Mentions légales' }} />
      <Stack.Screen name="Licenses" component={AboutLicenses} options={{ title: 'Licenses' }} />
    </Stack.Navigator>
  );
}

export default AboutStackNavigator;
