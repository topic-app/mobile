// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import DrawerNavigator from './src/views/main/index';
import SettingsNavigator from './src/views/settings/index';
import AuthNavigator from './src/views/auth/index';
import LocationNavigator from './src/views/location/index';

import Theme from './src/styles/Theme';

const RootNavigator = createStackNavigator({
  Main: DrawerNavigator,
  Settings: SettingsNavigator,
  Auth: AuthNavigator,
  Location: LocationNavigator,
}, {
  headerMode: 'none',
});

const Navigation = createAppContainer(RootNavigator);

// Render the app container component with the provider around it
export default class App extends React.Component {
  render() {
    return (
      <PaperProvider theme={Theme}>
        <Navigation />
      </PaperProvider>
    );
  }
}
