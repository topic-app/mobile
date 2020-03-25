// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';

function PetitionDisplayScreen({ navigation }) {
  return (
    <Button
      title="Retour"
      onPress={() => navigation.navigate('PetitionList')}
    />
  );
}

export default PetitionDisplayScreen;

PetitionDisplayScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
