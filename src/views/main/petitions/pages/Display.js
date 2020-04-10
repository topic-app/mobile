// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';

import { styles } from '../../../../styles/Styles';

function PetitionDisplayScreen({ route, petitions }) {
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

export default connect(mapStateToProps)(PetitionDisplayScreen);

PetitionDisplayScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  petitions: PropTypes.arrayOf(PropTypes.shape() /* A faire */).isRequired,
};
