import React from 'react';
import { View, Platform } from 'react-native';
import { TextInput, HelperText, Button, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

import { updateCreationData } from '@redux/actions/data/account';

import getAuthStyles from '../styles/Styles';

function AuthCreatePageProfile({ next, prev }) {
  const firstnameInput = React.createRef();
  const lastnameInput = React.createRef();

  const [currentFirstname, setCurrentFirstname] = React.useState({
    value: '',
    error: false,
    valid: false,
    message: false,
  });

  const [currentLastname, setCurrentLastname] = React.useState({
    value: '',
    error: false,
    valid: false,
    message: false,
  });

  let tempFirstname = '';
  let tempLastname = '';

  function setFirstname(data) {
    tempFirstname = { ...tempFirstname, ...data };
    setCurrentFirstname(tempFirstname);
  }

  function setLastname(data) {
    tempLastname = { ...tempLastname, ...data };
    setCurrentLastname(tempLastname);
  }

  async function validateFirstnameInput(firstname) {
    let validation = { valid: false, error: false };
    if (firstname !== '') {
      if (firstname.match(/^[a-zA-Z0-9_ ]*$/i) === null) {
        validation = {
          valid: false,
          error: true,
          message: 'Votre prénom ne peut pas contenir de caractères spéciaux',
        };
      } else {
        validation = { valid: true, error: false, message: '' };
      }
    }

    setFirstname(validation);
    return validation;
  }

  async function preValidateFirstnameInput(firstname) {
    if (firstname.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) !== null) {
      setFirstname({ valid: false, error: false });
    }
  }

  async function validateLastnameInput(lastname) {
    let validation = { valid: false, error: false };
    if (lastname !== '') {
      if (lastname.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) === null) {
        validation = {
          valid: false,
          error: true,
          message: 'Votre nom ne peut pas contenir de caractères spéciaux',
        };
      } else {
        validation = { valid: true, error: false };
      }
    }

    setLastname(validation);
    return validation;
  }

  async function preValidateLastnameInput(lastname) {
    if (lastname.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) !== null) {
      setLastname({ valid: true, error: false });
    }
  }

  function blurInputs() {
    firstnameInput.current.blur();
    lastnameInput.current.blur();
  }

  async function submit() {
    const firstnameVal = firstnameInput.current.state.value;
    const lastnameVal = lastnameInput.current.state.value;
    const firstname = await validateFirstnameInput(firstnameVal);
    const lastname = await validateLastnameInput(lastnameVal);
    if ((firstname.valid || !firstname) && (lastname.valid || !lastname)) {
      updateCreationData({ firstname: firstnameVal, lastname: lastnameVal });
      next();
    }
  }

  const theme = useTheme();
  const { colors } = theme;
  const authStyles = getAuthStyles(theme);

  return (
    <View style={authStyles.formContainer}>
      <View style={authStyles.textInputContainer}>
        <TextInput
          ref={firstnameInput}
          label="Prénom (facultatif)"
          value={currentFirstname.value}
          error={currentFirstname.error}
          autoCompleteType="name"
          disableFullscreenUI
          onSubmitEditing={({ nativeEvent }) => {
            validateFirstnameInput(nativeEvent.text);
            lastnameInput.current.focus();
          }}
          autoFocus
          theme={
            currentFirstname.valid
              ? { colors: { primary: colors.primary, placeholder: colors.valid } }
              : theme
          }
          mode="outlined"
          onEndEditing={({ nativeEvent }) => {
            validateFirstnameInput(nativeEvent.text);
          }}
          textContentType="givenName"
          style={authStyles.textInput}
          onChangeText={(text) => {
            setFirstname({ value: text });
            preValidateFirstnameInput(text);
          }}
        />
        <HelperText type="error" visible={currentFirstname.error}>
          {currentFirstname.message}
        </HelperText>
      </View>
      <View style={authStyles.textInputContainer}>
        <TextInput
          ref={lastnameInput}
          label="Nom (facultatif)"
          value={currentLastname.value}
          error={currentLastname.error}
          autoCompleteType="email"
          disableFullscreenUI
          onSubmitEditing={({ nativeEvent }) => {
            validateLastnameInput(nativeEvent.text);
            blurInputs();
            submit();
          }}
          autoCorrect={false}
          theme={
            currentLastname.valid
              ? { colors: { primary: colors.primary, placeholder: colors.valid } }
              : theme
          }
          textContentType="emailAddress"
          mode="outlined"
          onEndEditing={({ nativeEvent }) => {
            validateLastnameInput(nativeEvent.text);
          }}
          style={authStyles.textInput}
          onChangeText={(text) => {
            setLastname({ value: text });
            preValidateLastnameInput(text);
          }}
        />
        <HelperText type="error" visible={currentLastname.error}>
          {currentLastname.message}
        </HelperText>
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
          onPress={() => {
            blurInputs();
            submit();
          }}
          style={{ flex: 1, marginLeft: 5 }}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
}

export default AuthCreatePageProfile;

AuthCreatePageProfile.propTypes = {
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
};
