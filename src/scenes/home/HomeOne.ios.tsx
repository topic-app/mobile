import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeTwoNavigator from './HomeTwo';

const Stack = createStackNavigator();

function HomeOneNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home2" headerMode="none">
      <Stack.Screen name="Home2" component={HomeTwoNavigator} />
    </Stack.Navigator>
  );
}

export default HomeOneNavigator;
