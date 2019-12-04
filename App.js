import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import ActuArticleScreen from './pages/actus/Article'
import ActuListeScreen from './pages/actus/Liste'

const MainNavigator = createStackNavigator({
  ActuListe: {screen: ActuListeScreen},
  ActuArticle: {screen: ActuArticleScreen},
});

const App = createAppContainer(MainNavigator);

export default App;
