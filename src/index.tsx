import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import { connect } from 'react-redux';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import RootNavigator, { RootNavParams } from './scenes/Root';
import AuthStackNavigator, { AuthStackParams } from './scenes/auth/index';
import LandingStackNavigator, { LandingStackParams } from './scenes/landing/index';
import { State } from './ts/types';

export type AppStackParams = {
  Auth: NavigatorScreenParams<AuthStackParams>;
  Root: NavigatorScreenParams<RootNavParams>;
  Landing: NavigatorScreenParams<LandingStackParams>;
};

export type AppScreenNavigationProp<K extends keyof AppStackParams> = NativeStackNavigationProp<
  AppStackParams,
  K
>;

const Stack = createNativeStackNavigator<AppStackParams>();

type AppStackNavigatorProps = {
  locationSelected: boolean;
};

const AppStackNavigator: React.FC<AppStackNavigatorProps> = ({ locationSelected }) => {
  return (
    <Stack.Navigator
      initialRouteName={locationSelected ? 'Root' : 'Landing'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      <Stack.Screen name="Root" component={RootNavigator} />
      <Stack.Screen name="Landing" component={LandingStackNavigator} />
    </Stack.Navigator>
  );
};

const mapStateToProps = (state: State) => {
  const { selected } = state.location;
  return { locationSelected: selected };
};

export default connect(mapStateToProps)(AppStackNavigator);
