import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import MainStackNavigator from './Main';

export type RootNavParams = {
  Main: undefined;
};

const Stack = createStackNavigator<RootNavParams>();

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      headerMode="none"
      screenOptions={TransitionPresets.SlideFromRightIOS}
    >
      <Stack.Screen name="Main" component={MainStackNavigator} />
    </Stack.Navigator>
  );
}

export default RootNavigator;
