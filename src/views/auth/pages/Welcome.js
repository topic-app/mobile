import React from 'react';
import PropTypes from 'prop-types';
import { Button, View } from 'react-native';
import { TranslucentStatusBar } from '../../components/Tools';

function AuthWelcomeScreen({ navigation }) {
  return (
    <View>
      <TranslucentStatusBar />
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

export default AuthWelcomeScreen;

AuthWelcomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};