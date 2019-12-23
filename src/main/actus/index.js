import React, { Component } from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import ActuListScreen from './pages/List.js'
import ActuDisplayScreen from './pages/Display.js'

const ActuNavigator = createStackNavigator({
  ActuListe: ActuListScreen,
  ActuArticle: ActuDisplayScreen
})

export default ActuNavigator
