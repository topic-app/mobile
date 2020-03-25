// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import places from '../data/testQueryResults.json';

function CarteDisplayScreen({ navigation, route }) {
  const { id } = route.params;
  const place = places[id];

  console.log('Full-screen display!');
  console.log(place);

  return (
    <View style={{ flex: 1 }}>
      <Text>I am the full-screen display content</Text>
    </View>
  );
}

export default CarteDisplayScreen;

CarteDisplayScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
