// eslint-disable-next-line
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import ActuListScreen from './pages/List';
import ActuDisplayScreen from './pages/Display';

const ActuNavigator = createStackNavigator({
  ActuListe: ActuListScreen,
  ActuArticle: ActuDisplayScreen,
});

export default ActuNavigator;
