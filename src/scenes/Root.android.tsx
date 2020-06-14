import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import MainStackNavigator from './Main';

const Stack = createStackNavigator();

function MainNavigator() {
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

export default MainNavigator;
