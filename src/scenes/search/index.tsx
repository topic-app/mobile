import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Search from './views/Search';
import SearchTags from './views/Tags';

export type SearchStackParams = {
  Search: {
    initialCategory: 'articles' | 'events' | 'petitions' | 'locations' | 'groups' | 'users';
  };
  Tags: undefined;
};

const Stack = createStackNavigator<SearchStackParams>();

function SearchStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Search" headerMode="none">
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Tags" component={SearchTags} />
    </Stack.Navigator>
  );
}

export default SearchStackNavigator;
