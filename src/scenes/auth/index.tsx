import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { AppScreenNavigationProp } from '@root/src';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import AuthCreateScreen from './Create';
import AuthCreateSuccessScreen from './CreateSuccess';
import AuthLoginScreen from './Login';
import AuthResetPasswordScreen from './ResetPassword';

export type AuthStackParams = {
  Login: undefined;
  Create: undefined;
  ResetPassword: undefined;
  CreateSuccess: undefined;
};

export type AuthScreenNavigationProp<K extends keyof AuthStackParams> = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParams, K>,
  AppScreenNavigationProp<'Auth'>
>;

const Stack = createNativeStackNavigator<AuthStackParams>();

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={AuthLoginScreen} options={{ title: 'Se connecter' }} />
      <Stack.Screen
        name="Create"
        component={AuthCreateScreen}
        options={{ title: 'Créer un compte' }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={AuthResetPasswordScreen}
        options={{ title: 'Réinitialiser le mot de passe' }}
      />
      <Stack.Screen
        name="CreateSuccess"
        component={AuthCreateSuccessScreen}
        options={{ title: 'Compte créé' }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
