import React from 'react';
import { Button } from 'react-native';
import PropTypes from 'prop-types';

function LocationMapScreen({ navigation }) {
  return <Button title="Retour" onPress={() => navigation.navigate('ActuList')} />;
}

export default LocationMapScreen;

LocationMapScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
