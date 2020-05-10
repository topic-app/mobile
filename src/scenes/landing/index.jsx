import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import LandingWelcome from './views/Welcome';
import LandingArticles from './views/Articles';

const Stack = createStackNavigator();

function LandingStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={TransitionPresets.SlideFromRightIOS}>
      <Stack.Screen name="Welcome" component={LandingWelcome} options={{ headerShown: false }} />
      <Stack.Screen name="Articles" component={LandingArticles} />
    </Stack.Navigator>
  );
}

export default LandingStackNavigator;
