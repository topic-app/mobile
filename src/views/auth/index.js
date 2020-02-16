// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import AuthLoginScreen from './pages/Login';
import AuthCreateScreen from './pages/Create';

const SettingsNavigator = createStackNavigator({
  Login: AuthLoginScreen,
  Create: AuthCreateScreen,
});

export default SettingsNavigator;
