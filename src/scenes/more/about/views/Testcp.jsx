import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';

import StepperView from '@components/StepperView';

function About({ next, index }) {
  return (
    <View>
      <Text>{index}</Text>
      <Button onPress={() => next(1)}>Next</Button>
    </View>
  );
}

export default About;

About.propTypes = {
  index: PropTypes.number.isRequired,
  next: PropTypes.func.isRequired,
};
