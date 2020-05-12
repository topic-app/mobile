// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import getStyles from '@styles/Styles';

function PetitionDisplay({ route, petitions }) {
  const theme = useTheme();
  const { id } = route.params;
  const petition = petitions.find((t) => t._id === id);

  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      <Text style={styles.text}>Hello {JSON.stringify(petition)}</Text>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { petitions } = state;
  return { petitions: petitions.data, state: petitions.state };
};

export default connect(mapStateToProps)(PetitionDisplay);

PetitionDisplay.propTypes = {
  state: PropTypes.shape({
    success: PropTypes.bool,
    loading: PropTypes.shape({
      next: PropTypes.bool,
      initial: PropTypes.bool,
      refresh: PropTypes.bool,
    }),
    error: PropTypes.shape(),
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  petitions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      voteData: PropTypes.shape({
        type: PropTypes.string.isRequired,
        goal: PropTypes.number,
        votes: PropTypes.number,
        against: PropTypes.number,
        for: PropTypes.number,
        multiple: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            votes: PropTypes.number,
          }),
        ),
      }).isRequired,
      status: PropTypes.oneOf(['open', 'waiting', 'rejected', 'answered']),
      duration: PropTypes.shape({
        start: PropTypes.string.isRequired, // Note: need to change to instanceOf(Date) once we get axios working
        end: PropTypes.string.isRequired,
      }).isRequired,
      description: PropTypes.string,
      objective: PropTypes.string,
      votes: PropTypes.string,
    }).isRequired,
  ).isRequired,
};
