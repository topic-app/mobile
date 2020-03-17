// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import CarteListScreen from './pages/List';
import CarteDisplayScreen from './pages/Display';
import LocationModalContents from './components/locationModal';

import { customStyles } from '../../../styles/Styles';

const CarteNavigator = createStackNavigator({
  CarteListe: CarteListScreen,
  CarteArticle: CarteDisplayScreen,
}, {
  defaultNavigationOptions: {
    ...customStyles.header,
  },
});

export default CarteNavigator;
