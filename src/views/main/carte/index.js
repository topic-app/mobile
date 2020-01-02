// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import CarteListScreen from './pages/List';
import CarteDisplayScreen from './pages/Display';

const CarteNavigator = createStackNavigator({
  CarteListe: CarteListScreen,
  CarteArticle: CarteDisplayScreen,
});

export default CarteNavigator;
