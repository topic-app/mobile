import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

function About({ navigation }) {
  return (
    <View>
      <Text>About this app!</Text>
    </View>
  );
}

export default About;

About.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func,
  }).isRequired,
};
