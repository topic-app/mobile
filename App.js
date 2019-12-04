import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button } from 'react-native';

/*const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
});

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <TextInput>Hello</TextInput>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});*/

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

//import {ActuListeScreen} from './pages/actus/Liste';
//import {ActuArticleScreen} from './pages/actus/Article';

import ActuArticleScreen from './pages/actus/Article'

import ActuListeScreen from './pages/actus/Liste'

const MainNavigator = createStackNavigator({
  ActuListe: {screen: ActuListeScreen},
  ActuArticle: {screen: ActuArticleScreen},
});

const App = createAppContainer(MainNavigator);

export default App;
