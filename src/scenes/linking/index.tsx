import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';

import { AppScreenNavigationProp } from '@src/index';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@utils/compat/stack';

import DeleteAccount from './DeleteAccount';
import EmailChange from './EmailChange';
import EmailVerify from './EmailVerify';
import ResetPassword from './ResetPassword';

export type LinkingStackParams = {
  DeleteAccount: {
    id: string;
    token: string;
  };
  EmailChange: {
    id: string;
    token: string;
  };
  EmailVerify: {
    id: string;
    token: string;
  };
  ResetPassword: {
    id: string;
    token: string;
  };
};

export type LinkingScreenNavigationProp<
  K extends keyof LinkingStackParams
> = CompositeNavigationProp<
  NativeStackNavigationProp<LinkingStackParams, K>,
  AppScreenNavigationProp<'Linking'>
>;

const Stack = createNativeStackNavigator<LinkingStackParams>();

function LinkingStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={{ headerShown: false, title: 'Supprimer mon compte' }}
      />
      <Stack.Screen
        name="EmailChange"
        component={EmailChange}
        options={{ headerShown: false, title: 'Changer mon adresse email' }}
      />
      <Stack.Screen
        name="EmailVerify"
        component={EmailVerify}
        options={{ headerShown: false, title: 'Vérifier mon adresse email' }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerShown: false, title: 'Réinitialiser mon mot de passe' }}
      />
    </Stack.Navigator>
  );
}

export default LinkingStackNavigator;
