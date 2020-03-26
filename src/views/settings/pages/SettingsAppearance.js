import React from 'react';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';

function SettingsAppearanceScreen({ navigation }) {
  return (
    <Button
      title="Retour"
      onPress={() => navigation.goBack()}
    />
  );
}

export default SettingsAppearanceScreen;

SettingsAppearanceScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
