import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import HomeTwoNavigator from './HomeTwo';

const Stack = createNativeStackNavigator();

function HomeOneNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home2" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home2" component={HomeTwoNavigator} />
    </Stack.Navigator>
  );
}

export default HomeOneNavigator;
