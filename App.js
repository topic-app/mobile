// eslint-disable-next-line no-unused-vars
import 'react-native-gesture-handler';
import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';

import DrawerNavigator from './src/views/main/drawer';
import SettingsNavigator from './src/views/settings/index';
import AuthNavigator from './src/views/auth/index';
import LocationNavigator from './src/views/location/index';
import SearchScreen from './src/views/components/Search';

import Reducer from './src/reducers/index';

import Theme from './src/styles/Theme';

enableScreens();

// NOTE: Update @react-native-mapbox-gl to get rid of warning
console.disableYellowBox = ['Animated:'];

const Stack = createStackNavigator();

const Store = createStore(Reducer);

function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Root" headerMode="none">
      <Stack.Screen name="Root" component={DrawerNavigator} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Location" component={LocationNavigator} />
      <Stack.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{ ...TransitionPresets.SlideFromRightIOS }}
      />
      <Stack.Screen name="Search" component={SearchScreen} />
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
