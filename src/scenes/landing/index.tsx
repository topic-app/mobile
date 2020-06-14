import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import LandingWelcome from './views/Welcome';
import LandingInfo from './views/Info';
import SelectLocation from './views/SelectLocation';

const Stack = createStackNavigator();

function LandingStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={TransitionPresets.SlideFromRightIOS}>
      <Stack.Screen name="Welcome" component={LandingWelcome} options={{ headerShown: false }} />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Info" component={LandingInfo} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default LandingStackNavigator;
