import React from 'react';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';

function SettingsGeneralScreen({ navigation }) {
  return (
    <Button
      title="Retour"
      onPress={() => navigation.goBack()}
    />
  );
}

export default SettingsGeneralScreen;

SettingsGeneralScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
