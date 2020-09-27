import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import AuthLoginScreen from './views/Login';
import AuthCreateScreen from './views/Create';
import AuthResetPasswordScreen from './views/ResetPassword';
import AuthCreateSuccessScreen from './views/CreateSuccess';

export type AuthStackParams = {
  Login: undefined;
  Create: undefined;
  ResetPassword: undefined;
  CreateSuccess: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParams>();

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={AuthLoginScreen}
        options={{
          title: 'Se connecter',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Create"
        component={AuthCreateScreen}
        options={{
          title: 'Créer un compte',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={AuthResetPasswordScreen}
        options={{
          title: 'Réinitialiser le mot de passe',
        }}
      />
      <Stack.Screen
        name="CreateSuccess"
        component={AuthCreateSuccessScreen}
        options={{
          title: 'Compte créé',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
