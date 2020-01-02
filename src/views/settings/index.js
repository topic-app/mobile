// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import SettingsHomeScreen from './pages/Home';

const SettingsNavigator = createStackNavigator({
  Home: SettingsHomeScreen,
});

export default SettingsNavigator;
