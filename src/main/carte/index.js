import React, { Component } from 'react';
import {createStackNavigator} from 'react-navigation-stack';

import CarteListScreen from './pages/List.js'
import CarteDisplayScreen from './pages/Display.js'

const CarteNavigator = createStackNavigator({
  CarteListe: CarteListScreen,
  CarteArticle: CarteDisplayScreen
})

export default CarteNavigator
