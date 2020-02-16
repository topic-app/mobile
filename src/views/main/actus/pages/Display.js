import React from 'react';
import { View, Text } from 'react-native';

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
