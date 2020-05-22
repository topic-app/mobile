import React from 'react';
import { View, Platform } from 'react-native';
import { Button, Title, Subheading, Card, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateCreationData } from '@redux/actions/data/account';

import getAuthStyles from '../styles/Styles';

function AuthCreatePageSchool({ next, prev, location }) {
  const submit = () => {
    updateCreationData({
      schools: location.schools,
      departments: location.departments,
      global: location.global,
    });
    next();
  };

  const theme = useTheme();
  const authStyles = getAuthStyles(theme);
  const { colors } = theme;

  return (
    <View style={authStyles.formContainer}>
      {location.schoolData.map((s) => (
        <Card key={s._id} style={{ marginBottom: 30 }}>
          <Card.Content>
            <Title>{s?.name}</Title>
            <Subheading>{s?.address?.shortName || s?.address?.address?.city}</Subheading>
          </Card.Content>
        </Card>
      ))}
      {location.departmentData.map((d) => (
        <Card key={d._id} style={{ marginBottom: 30 }}>
          <Card.Content>
            <Title>{d?.name}</Title>
            <Subheading>{d?.type === 'region' ? 'Région' : 'Département'}</Subheading>
          </Card.Content>
        </Card>
      ))}
      {location.global && (
        <Card style={{ marginBottom: 30 }}>
          <Card.Content>
            <Title>France entière</Title>
            <Subheading>Pas d&apos;école ou département spécifique</Subheading>
          </Card.Content>
        </Card>
      )}
      <View style={authStyles.changeButtonContainer}>
        <Button mode="text">Changer</Button>
      </View>
      <View style={authStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => prev()}
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
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  location: PropTypes.shape({
    schools: PropTypes.arrayOf(PropTypes.string),
    departments: PropTypes.arrayOf(PropTypes.string),
    global: PropTypes.bool,
    schoolData: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        types: PropTypes.arrayOf(PropTypes.string),
        address: PropTypes.shape({
          shortName: PropTypes.string,
          address: PropTypes.shape({
            city: PropTypes.string,
          }),
        }),
      }),
    ),
    departmentData: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
      }),
    ),
  }).isRequired,
};
