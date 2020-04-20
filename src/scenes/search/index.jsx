import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Search from './views/Search';
import SearchTags from './views/Tags';

const Stack = createStackNavigator();

function SearchStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Search" headerMode="none">
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Tags" component={SearchTags} />
    </Stack.Navigator>
  );
}

export default SearchStackNavigator;
