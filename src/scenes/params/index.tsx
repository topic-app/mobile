import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import ArticleConfigureStackNavigator from './articles/index';
import EventConfigureStackNavigator from './events/index';

const Stack = createNativeStackNavigator();

function ConfigureStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Article" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Article" component={ArticleConfigureStackNavigator} />
      <Stack.Screen name="Event" component={EventConfigureStackNavigator} />
    </Stack.Navigator>
  );
}

export default ConfigureStackNavigator;
