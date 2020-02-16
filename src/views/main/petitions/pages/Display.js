// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { Button } from 'react-native';
// import { customStyles } from '../../../../styles/Styles';

export default class PetitionDisplayScreen extends React.Component {
  static navigationOptions = {
    title: 'Petitions: Display',
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Retour"
        onPress={() => navigate('PetitionList')}
      />
    );
  }
}
