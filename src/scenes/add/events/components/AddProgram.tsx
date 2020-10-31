import React from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { Account, State } from '@ts/types';
import { StepperViewPageProps } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & { account: Account };

const EventAddPageProgram: React.FC<Props> = ({ next, prev, account }) => {
  const [showError, setError] = React.useState(false);

  const contentInput = React.createRef<RNTestInput>();
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

  function blurInputs() {
    contentInput.current?.blur();
  }

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
      <Text>Programme</Text>
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
          onPress={() => {
            blurInputs();
            submit();
          }}
          style={{ flex: 1, marginLeft: 5 }}
        >
          Publier
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account };
};

export default connect(mapStateToProps)(EventAddPageProgram);
