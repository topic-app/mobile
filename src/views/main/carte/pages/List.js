// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { Text } from 'react-native';
// import { customStyles } from '../../../../styles/Styles';

export default class CarteListScreen extends React.Component {
  static navigationOptions = {
    title: 'Carte',
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <Text>Hello</Text>
    );
  }
}
