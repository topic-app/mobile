import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MainScreenNavigationProp } from '../Main';
import Search from './views/Search';

export type SearchStackParams = {
  Search: {
    initialCategory: 'articles' | 'events' | 'groups' | 'users';
  };
};

export type SearchScreenNavigationProp<K extends keyof SearchStackParams> = CompositeNavigationProp<
  NativeStackNavigationProp<SearchStackParams, K>,
  MainScreenNavigationProp<'Search'>
>;

const Stack = createNativeStackNavigator<SearchStackParams>();

function SearchStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Search" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={Search} options={{ title: 'Recherche' }} />
    </Stack.Navigator>
  );
}

export default SearchStackNavigator;
