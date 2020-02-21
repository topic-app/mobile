import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';

export default class LocationMapScreen extends React.Component {
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

LocationMapScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};