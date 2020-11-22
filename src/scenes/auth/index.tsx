import React from 'react';
import { createNativeStackNavigator } from '@utils/stack';

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
