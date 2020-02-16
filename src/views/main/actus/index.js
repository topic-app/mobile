// eslint-disable-next-line
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import ActuListScreen from './pages/List';
import ActuDisplayScreen from './pages/Display';

import colors from '../../../utils/Colors';

const ActuNavigator = createStackNavigator({
  ActuListe: ActuListScreen,
  ActuArticle: ActuDisplayScreen,
}, {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: colors.tabBackground,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

export default ActuNavigator;
