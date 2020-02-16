import React from 'react';
import { Button, View, Text } from 'react-native';

import data from '../data/testDataList.json';
import actusStyles from '../styles/Styles';
import colors from '../../../../utils/Colors';

export default class ActuDisplayScreen extends React.Component {
  static navigationOptions = {
    title: 'Actus et évènements: Display',
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Test</Text>
      </View>
    );
  }
}
