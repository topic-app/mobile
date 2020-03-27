// eslint-disable-next-line no-unused-vars
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';

import DrawerNavigator from './src/views/main/index';
import SettingsNavigator from './src/views/settings/index';
import AuthNavigator from './src/views/auth/index';
import LocationNavigator from './src/views/location/index';

import Reducer from './src/reducers/index';

import Theme from './src/styles/Theme';

const Stack = createStackNavigator();

const Store = createStore(Reducer);

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main" headerMode="none">
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Location" component={LocationNavigator} />
    </Stack.Navigator>
  );
}

// Render the app container component with the provider around it
export default class App extends React.Component {
  render() {
    return (
      <ReduxProvider store={Store}>
        <PaperProvider theme={Theme}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PaperProvider>
      </ReduxProvider>
    );
  }
}
