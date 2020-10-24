import React, {createRef } from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { TextInput, Button, List, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Account, State, EventCreationData, EventPlace } from '@ts/types';
import { StepperViewPageProps, InlineCard } from '@components/index';
import getStyles from '@styles/Styles';
import { updateEventCreationData } from '@redux/actions/contentData/events';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & {
  account: Account;
  creationData: EventCreationData;
  navigation: any;
};

const EventAddPageContact: React.FC<Props> = ({ next, prev, account}) => {
 
  const [showError, setError] = React.useState(false);
 
  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const phoneInput = createRef<RNTestInput>();
  const emailInput = createRef<RNTestInput>();

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempPhone: InputStateType;
  let tempEmail: InputStateType;

  const [currentPhone, setCurrentPhone] = React.useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });

  const [currentEmail, setCurrentEmail] = React.useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });

  function setPhone(data: Partial<InputStateType>) {
    // Because async setState
    tempPhone = { ...currentPhone, ...(tempPhone ?? {}), ...data };
    setCurrentPhone(tempPhone);
  }

  function setEmail(data: Partial<InputStateType>) {
    // Because async setState
    tempEmail = { ...currentEmail, ...(tempEmail ?? {}), ...data };
    setCurrentEmail(tempEmail);
  }

  async function validatePhoneInput(content: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };
      if (content.length !== 0 && content.length !== 10) {
        validation = {
          valid: false,
          error: true,
          message: 'Entrez un numéro de téléphone valide',
        };
      } else {
        validation = { valid: true, error: false };
      }
    setPhone(validation);
    return validation;
  }

  function preValidatePhoneInput(content: string) {
    if (content.length !== 0 && content.length !== 10) {
      setPhone({ valid: false, error: false });
    }
  }

  function blurInputs() {
    phoneInput.current?.blur();
    emailInput.current?.blur();
  }

  async function submit() {
    blurInputs();
    const phoneVal = currentPhone.value;
    const emailVal = currentEmail.value;

    const phone = await validatePhoneInput(phoneVal);
    if (phone.valid) {
      updateEventCreationData({ phone: phoneVal, email: emailVal });
    } else {
      if (!phone.valid && !phone.error) {
        setPhone({
          valid: false,
          error: true,
          message: 'Entrez un numéro de téléphone valide',
        });
      }
    }
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
      <TextInput
        ref={phoneInput}
        label="Numéro de téléphone"
        value={currentPhone.value}
        error={currentPhone.error}
        keyboardType="phone-pad"
        disableFullscreenUI
        onSubmitEditing={({ nativeEvent }) => {
          validatePhoneInput(nativeEvent.text);
          emailInput.current?.focus();
        }}
        autoCorrect={false}
        autoFocus
        theme={
          currentPhone.valid
            ? { colors: { primary: colors.primary, placeholder: colors.valid } }
            : theme
        }
        mode="outlined"
        onEndEditing={({ nativeEvent }) => {
          validatePhoneInput(nativeEvent.text);
        }}
        style={eventStyles.textInput}
        onChangeText={(text) => {
          setPhone({ value: text });
          preValidatePhoneInput(text);
        }}
      />

      <TextInput
        ref={emailInput}
        label="Adresse mail"
        value={currentEmail.value}
        error={currentEmail.error}
        keyboardType="email-address"
        disableFullscreenUI
        autoCorrect={false}
        theme={{ colors: { primary: colors.primary, placeholder: colors.valid } }
        }
        mode="outlined"
        style={eventStyles.textInput}
        onChangeText={(text) => {
          setEmail({ value: text });
        }}
      />

      <View style={{height:20}}/>

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

export default connect(mapStateToProps)(EventAddPageContact);
