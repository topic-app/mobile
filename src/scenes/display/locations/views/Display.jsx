// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import places from '@src/data/explorerListData.json';

function LocationDisplay({ navigation, route }) {
  const { id } = route.params;
  const place = places.find((t) => t._id === data.id);

  console.log('Full-screen display!');
  console.log(place);

  return (
    <View style={{ flex: 1 }}>
      <Text>I am the full-screen display content</Text>
    </View>
  );
}

export default LocationDisplay;

LocationDisplay.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
