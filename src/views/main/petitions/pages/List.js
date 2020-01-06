// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { Text } from 'react-native';

import colors from '../../../../utils/Colors';

export default class PetitionListScreen extends React.Component {
  static navigationOptions = {
    title: 'Pétitions',
    headerStyle: {
      backgroundColor: colors.tabBackground,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <Text>Text</Text>
    );
  }
}
