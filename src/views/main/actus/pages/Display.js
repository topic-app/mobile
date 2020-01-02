import React from 'react';
import { Button } from 'react-native';

export default class ActuDisplayScreen extends React.Component {
  static navigationOptions = {
    title: 'Actus et évènements: Display',
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return <Button title="Retour" onPress={() => navigate('ActuList')} />;
  }
}
