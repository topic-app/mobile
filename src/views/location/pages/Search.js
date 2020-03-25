import React from 'react';
import { Button } from 'react-native';
import PropTypes from 'prop-types';

function LocationSearchScreen({ navigation }) {
  return (
    <Button
      title="Retour"
      onPress={() => navigation.navigate('ActuList')}
    />
  );
}

export default LocationSearchScreen;

LocationSearchScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
