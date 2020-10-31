import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import LandingWelcome from './views/Welcome';
import LandingInfo from './views/Info';
import SelectLocation from './views/SelectLocation';

export type LandingStackParams = {
  Welcome: undefined;
  SelectLocation: undefined;
  Info: { index: number };
};

const Stack = createStackNavigator<LandingStackParams>();

function LandingStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={Platform.OS === 'web' ? 'SelectLocation' : 'Welcome'}
      screenOptions={{ ...TransitionPresets.SlideFromRightIOS, headerShown: false }}
    >
      <Stack.Screen name="SelectLocation" component={SelectLocation} />
      <Stack.Screen name="Welcome" component={LandingWelcome} />
      <Stack.Screen name="Info" component={LandingInfo} />
    </Stack.Navigator>
  );
}

export default LandingStackNavigator;
