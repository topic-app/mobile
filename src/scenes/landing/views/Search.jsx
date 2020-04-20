import React from 'react';
import { Button } from 'react-native';
import PropTypes from 'prop-types';

function LandingSearch({ navigation }) {
  return <Button title="Retour" onPress={() => console.log('Retour! :)')} />;
}

export default LandingSearch;

LandingSearch.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
