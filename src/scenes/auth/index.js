import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AuthLoginScreen from './views/Create';
import AuthCreateScreen from './views/Login';
import AuthResetPasswordScreen from './views/ResetPassword';

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={AuthLoginScreen}
        options={{
          title: 'Se connecter',
        }}
      />
      <Stack.Screen
        name="Create"
        component={AuthCreateScreen}
        options={{
          title: 'Créer un compte',
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={AuthResetPasswordScreen}
        options={{
          title: 'Réinitialiser le mot de passe',
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;