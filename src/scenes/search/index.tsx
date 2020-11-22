import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import { MainScreenNavigationProp } from '../Main';
import Search from './views/Search';
import SearchTags from './views/Tags';

export type SearchStackParams = {
  Search: {
    initialCategory: 'articles' | 'events' | 'petitions' | 'locations' | 'groups' | 'users';
  };
  Tags: undefined;
};

export type SearchScreenNavigationProp<K extends keyof SearchStackParams> = CompositeNavigationProp<
  NativeStackNavigationProp<SearchStackParams, K>,
  MainScreenNavigationProp<'Search'>
>;

const Stack = createNativeStackNavigator<SearchStackParams>();

function SearchStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Search" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Tags" component={SearchTags} />
    </Stack.Navigator>
  );
}

export default SearchStackNavigator;
