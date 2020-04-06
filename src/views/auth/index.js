// eslint-disable-next-line no-unused-vars
import React from 'react';
import { StatusBar } from 'react-native';
import { Appbar } from 'react-native-paper';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import AuthWelcomeScreen from './pages/Welcome';
import AuthLoginScreen from './pages/Create';
import AuthCreateScreen from './pages/Login';

import { CustomHeaderBar } from '../components/Headers';

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen
        name="Welcome"
        component={AuthWelcomeScreen}
        options={{
          title: 'Bienvenue',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={AuthLoginScreen}
        options={{
          title: 'Se connecter',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Create"
        component={AuthCreateScreen}
        options={{
          title: 'Créer un compte',
          header: ({ scene, previous, navigation }) => (
            <CustomHeaderBar scene={scene} previous={previous} navigation={navigation} />
          ),
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
