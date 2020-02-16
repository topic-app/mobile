// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { Text } from 'react-native';

// import { customStyles } from '../../../../styles/Styles';

export default class PetitionListScreen extends React.Component {
  static navigationOptions = {
    title: 'Pétitions',
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <Text>Text</Text>
    );
  }
}
