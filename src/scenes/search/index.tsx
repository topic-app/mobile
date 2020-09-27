import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import Search from './views/Search';
import SearchTags from './views/Tags';

export type SearchStackParams = {
  Search: {
    initialCategory: 'articles' | 'events' | 'petitions' | 'locations' | 'groups' | 'users';
  };
  Tags: undefined;
};

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
