import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { styles } from '../../../../styles/Styles';

function PetitionDisplay({ route, petitions }) {
  const { id } = route.params;
  const petition = petitions.find((t) => t.petitionId === id);

  return (
    <View style={styles.page}>
      <Text style={styles.text}>Hello {JSON.stringify(petition)}</Text>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { petitions } = state;
  return { petitions };
};

export default connect(mapStateToProps)(PetitionDisplay);

PetitionDisplay.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  petitions: PropTypes.arrayOf(PropTypes.shape() /* A faire */).isRequired,
};
