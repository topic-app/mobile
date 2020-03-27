import React from 'react';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';

function SettingsGeneralScreen({ navigation }) {
  return <Button onPress={() => navigation.navigate('SettingsList')}>Retour</Button>;
}

export default SettingsGeneralScreen;

SettingsGeneralScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
