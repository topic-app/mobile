// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import PetitionListScreen from './pages/List';
import PetitionDisplayScreen from './pages/Display';

import { customStyles } from '../../../styles/Styles';

const PetitionNavigator = createStackNavigator({
  PetitionListe: PetitionListScreen,
  PetitionArticle: PetitionDisplayScreen,
}, {
  defaultNavigationOptions: {
    ...customStyles.header,
  },
});

export default PetitionNavigator;
