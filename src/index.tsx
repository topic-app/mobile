import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import Store from "@redux/store";

import RootNavigator from "./scenes/Root";
import AuthStackNavigator from "./scenes/auth/index";
import LandingStackNavigator from "./scenes/landing/index";

export type AppStackParams = {
  Auth: undefined;
  Root: undefined;
  Landing: undefined;
};

const Stack = createStackNavigator<AppStackParams>();

function AppStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={Store.getState().location.selected ? "Root" : "Landing"}
      headerMode="none"
      screenOptions={TransitionPresets.SlideFromRightIOS}
    >
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="Root" component={RootNavigator} />
      <Stack.Screen name="Landing" component={LandingStackNavigator} />
    </Stack.Navigator>
  );
}

export default AppStackNavigator;
