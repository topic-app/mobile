import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, TextInput, Button,
} from 'react-native';

export default class SettingsHomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    const { navigation } = this.props;
    const { navigate } = navigation;
    return (
      <Button
        title="Retour"
        onPress={() => navigate('ActuList')}
      />
    );
  }
}
