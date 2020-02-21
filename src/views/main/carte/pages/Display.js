// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { Button } from 'react-native';
// import { customStyles } from '../../../../styles/Styles';

export default class CarteDisplayScreen extends React.Component {
  static navigationOptions = {
    title: 'Carte: Display',
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Retour"
        onPress={() => navigate('CarteList')}
      />
    );
  }
}