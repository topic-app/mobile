import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import AuthLoginScreen from './pages/Create';
import AuthCreateScreen from './pages/Login';

import { ListHeaderConfig } from '../components/Headers';

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen
        name="Login"
        component={AuthLoginScreen}
        options={{
          title: 'Se connecter',
          ...ListHeaderConfig,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Create"
        component={AuthCreateScreen}
        options={{
          title: 'Créer un compte',
          ...ListHeaderConfig,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
