import React from 'react';
import { View, Platform } from 'react-native';
import { Button, Title, Subheading, Card, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateCreationData } from '@redux/actions/data/account';

import getAuthStyles from '../styles/Styles';

function AuthCreatePageSchool({ forward, backward, location }) {
  const submit = () => {
    updateCreationData({
      schools: location.schools,
      departments: location.departments,
      global: location.global,
    });
    forward();
  };

  const theme = useTheme();
  const { colors } = theme;
  const authStyles = getAuthStyles(theme);

  return (
    <View style={authStyles.formContainer}>
      <Card style={{ marginBottom: 30 }}>
        <Card.Content>
          <Title>{location.schoolData[0].name}</Title>
          <Subheading>{location.schoolData[0].address?.shortName}</Subheading>
        </Card.Content>
        <Card.Actions>
          <Button mode="text" onPress={() => console.log('Change schools')}>
            Changer d&apos;école
          </Button>
        </Card.Actions>
      </Card>
      <View style={authStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => backward()}
          style={{ flex: 1, marginRight: 5 }}
        >
          Retour
        </Button>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => submit()}
          style={{ flex: 1, marginLeft: 5 }}
          theme={{ primary: colors.primary }}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { location } = state;
  return { location };
};

export default connect(mapStateToProps)(AuthCreatePageSchool);

AuthCreatePageSchool.propTypes = {
  forward: PropTypes.func.isRequired,
  backward: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
};
