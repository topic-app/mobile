import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';

import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/stack';

import RootNavigator, { RootNavParams } from './scenes/Root';
import AuthStackNavigator, { AuthStackParams } from './scenes/auth/index';
import LandingStackNavigator, { LandingStackParams } from './scenes/landing/index';
import LinkingStackNavigator, { LinkingStackParams } from './scenes/linking/index';
import { State } from './ts/types';

export type AppStackParams = {
  Auth: NavigatorScreenParams<AuthStackParams>;
  Root: NavigatorScreenParams<RootNavParams>;
  Linking: NavigatorScreenParams<LinkingStackParams>;
  Landing: NavigatorScreenParams<LandingStackParams>;
};

export type AppScreenNavigationProp<K extends keyof AppStackParams> = NativeStackNavigationProp<
  AppStackParams,
  K
>;

const Stack = createNativeStackNavigator<AppStackParams>();

type AppStackNavigatorProps = {
  locationSelected: boolean;
  loggedIn: boolean;
};

const AppStackNavigator: React.FC<AppStackNavigatorProps> = ({ locationSelected, loggedIn }) => {
  return (
    <Stack.Navigator
      initialRouteName={
        Platform.OS === 'web' && !loggedIn ? 'Auth' : locationSelected ? 'Root' : 'Landing'
      }
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={AuthStackNavigator} />
      {(Platform.OS !== 'web' || loggedIn) && (
        <Stack.Screen name="Root" component={RootNavigator} />
      )}
      {(Platform.OS !== 'web' || loggedIn) && (
        <Stack.Screen name="Landing" component={LandingStackNavigator} />
      )}
      <Stack.Screen name="Linking" component={LinkingStackNavigator} />
    </Stack.Navigator>
  );
};

const mapStateToProps = (state: State) => {
  const { selected } = state.location;
  const { loggedIn } = state.account;
  return { locationSelected: selected, loggedIn };
};

export default connect(mapStateToProps)(AppStackNavigator);
