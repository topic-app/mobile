import React from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import {
  Button,
  RadioButton,
  HelperText,
  List,
  Text,
  useTheme,
  Card,
  Title,
} from 'react-native-paper';

import { updateEventCreationData } from '@redux/actions/contentData/events';
import { StepperViewPageProps } from '@components/index';
import { Account, State } from '@ts/types';
import getStyles from '@styles/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import getAuthStyles from '../styles/Styles';
import { connect } from 'react-redux';
import { add } from 'react-native-reanimated';

type Props = StepperViewPageProps & { account: Account; add: Function };

const EventAddPageProgram: React.FC<Props> = ({ prev, add, account }) => {
  const [showError, setError] = React.useState(false);

  const contentInput = React.createRef<RNTestInput>();
  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);
  const submit = () => {
    updateEventCreationData({ parser: 'markdown', program: null });
    add('markdown');
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
      <View style={styles.container}>
        <Title>Aucun programme (non implémenté)</Title>
      </View>
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
