import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { HeaderConfig } from '@components/Header';
import ArticleConfigure from './views/Configure';

const Stack = createNativeStackNavigator();

function ArticleListsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Configure">
      <Stack.Screen
        name="Configure"
        component={ArticleConfigure}
        options={({ route }) => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}

export default ArticleListsStackNavigator;
