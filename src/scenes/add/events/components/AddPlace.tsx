import React from 'react';
import { View, Platform } from 'react-native';
import { Button, RadioButton, HelperText, List, Text, useTheme, Card } from 'react-native-paper';

import { updateEventCreationData } from '@redux/actions/contentData/events';
import { StepperViewPageProps } from '@components/index';
import { Account, State } from '@ts/types';
import getStyles from '@styles/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import getAuthStyles from '../styles/Styles';
import { connect } from 'react-redux';

type Props = StepperViewPageProps & { account: Account };

const EventAddPagePlace: React.FC<Props> = ({ next, prev, account }) => {
  const [showError, setError] = React.useState(false);

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);
  const submit = () => {
    {
      /* updateEventCreationData({ tags: selectedTags }); */
    }
    next();
  };

  if (!account.loggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.centerIllustrationContainer}>
          <Text>Non autorisé</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={eventStyles.formContainer}>
      <Text>Place</Text>
      <View style={eventStyles.buttonContainer}>
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
  const { account } = state;
  return { account };
};

export default connect(mapStateToProps)(EventAddPagePlace);
