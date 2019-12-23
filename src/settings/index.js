import React, { Component } from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import SettingsHomeScreen from './pages/Home.js'

const SettingsNavigator = createStackNavigator({
  Home: SettingsHomeScreen
})

export default SettingsNavigator
