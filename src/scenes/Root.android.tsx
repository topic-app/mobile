import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import MainStackNavigator from './Main';

export type RootNavParams = {
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootNavParams>();

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainStackNavigator} />
    </Stack.Navigator>
  );
}

export default RootNavigator;
