import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LandingWelcome from './views/Welcome';
import LandingSearch from './views/Search';
import LandingMap from './views/Map';

const Stack = createStackNavigator();

function LandingStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" headerMode="none">
      <Stack.Screen name="Welcome" component={LandingWelcome} />
      <Stack.Screen name="Search" component={LandingSearch} />
      <Stack.Screen name="Map" component={LandingMap} />
    </Stack.Navigator>
  );
}

export default LandingStackNavigator;
