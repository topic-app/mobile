import React from 'react';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';

function SettingsAppearanceScreen({ navigation }) {
  return <Button onPress={() => navigation.navigate('SettingsList')}>Retour</Button>;
}

export default SettingsAppearanceScreen;

SettingsAppearanceScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
