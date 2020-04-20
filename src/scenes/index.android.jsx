import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import DisplayStackNavigator from './display/index';
import MoreStackNavigator from './more/index';
import SearchStackNavigator from './search/index';
import HomeOneNavigator from './home/HomeOne';

const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home1"
      headerMode="none"
      screenOptions={TransitionPresets.SlideFromRightIOS}
    >
      <Stack.Screen name="Display" component={DisplayStackNavigator} />
      <Stack.Screen name="More" component={MoreStackNavigator} />
      <Stack.Screen name="Search" component={SearchStackNavigator} />
      <Stack.Screen name="Home1" component={HomeOneNavigator} />
    </Stack.Navigator>
  );
}

export default MainNavigator;
