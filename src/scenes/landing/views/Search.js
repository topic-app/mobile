import React from 'react';
import { Button } from 'react-native';
import PropTypes from 'prop-types';

function LandingLocationSearch({ navigation }) {
  return <Button title="Retour" onPress={() => navigation.navigate('ActuList')} />;
}

export default LandingLocationSearch;

LandingLocationSearch.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
