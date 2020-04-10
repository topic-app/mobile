import React from 'react';
import PropTypes from 'prop-types';
import { Button, View } from 'react-native';
import { TranslucentStatusBar } from '../../components/Headers';

function LandingWelcomeSearch({ navigation }) {
  return (
    <View>
      <TranslucentStatusBar />
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

export default LandingWelcomeSearch;

LandingWelcomeSearch.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
