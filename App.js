// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import DrawerNavigator from './src/views/main/index';
import SettingsNavigator from './src/views/settings/index';

const RootNavigator = createStackNavigator({
  Main: DrawerNavigator,
  Settings: SettingsNavigator,
}, {
  headerMode: 'none',
});

const App = createAppContainer(RootNavigator);

export default App;
