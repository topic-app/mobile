import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { TranslucentStatusBar } from '../../../components/Header';

function LandingWelcome({ navigation }) {
  return (
    <View>
      <TranslucentStatusBar />
      <Text>Welcome to Topic!</Text>
    </View>
  );
}

export default LandingWelcome;

LandingWelcome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
