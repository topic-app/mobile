import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import {createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'

import DrawerNavigator from './src/main/index.js'
import SettingsNavigator from './src/settings/index.js'

const RootNavigator = createStackNavigator({
  Main: DrawerNavigator,
  Settings: SettingsNavigator,
}, {
  headerMode: 'none',
})

const App = createAppContainer(RootNavigator);

export default App;
