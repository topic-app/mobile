import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import DisplayStackNavigator from './display/index';
import MoreStackNavigator from './more/index';
import SearchStackNavigator from './search/index';
import HomeOneNavigator from './home/HomeOne';

function getNestedParams(route) {
  let { params } = route;
  while (params.params) {
    params = params.params;
  }
  return params;
}

let screenOptions = TransitionPresets.SlideFromRightIOS;
if (Platform.OS === 'ios') {
  screenOptions = ({ route }) => {
    if (route.params && getNestedParams(route).noTransition) {
      return {
        cardStyleInterpolator: () => ({ cardStyle: null }),
      };
    }
    return null;
  };
}

const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home1" headerMode="none" screenOptions={screenOptions}>
      <Stack.Screen name="Display" component={DisplayStackNavigator} />
      <Stack.Screen name="More" component={MoreStackNavigator} />
      <Stack.Screen name="Search" component={SearchStackNavigator} />
      <Stack.Screen name="Home1" component={HomeOneNavigator} />
    </Stack.Navigator>
  );
}

export default MainNavigator;
