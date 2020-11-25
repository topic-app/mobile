import React from 'react';
import { View, Platform } from 'react-native';
import { Button, Title, Subheading, Card } from 'react-native-paper';
import { connect } from 'react-redux';

import { StepperViewPageProps } from '@components/index';
import { updateCreationData } from '@redux/actions/data/account';
import { State } from '@ts/types';
import { useTheme } from '@utils/index';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & {
  location: State['location'];
  landing: () => any;
};

const AuthCreatePageSchool: React.FC<Props> = ({ next, prev, location, landing }) => {
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
        <Button mode="text" onPress={landing}>
          Changer
        </Button>
      </View>
      <View style={authStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
          uppercase={Platform.OS !== 'ios'}
          onPress={prev}
          style={{ flex: 1, marginRight: 5 }}
        >
          Retour
        </Button>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={submit}
          style={{ flex: 1, marginLeft: 5 }}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { location } = state;
  return { location };
};

export default connect(mapStateToProps)(AuthCreatePageSchool);
