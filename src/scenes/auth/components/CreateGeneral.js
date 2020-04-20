import React from 'react';
import { View, Platform } from 'react-native';
import { TextInput, HelperText, Button, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

import { updateCreationData, updateState } from '../../../redux/actions/account';
import request from '../../../utils/request';

import getAuthStyles from '../styles/Styles';

class AuthCreatePageGeneral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: false,
      usernameValid: false,
      usernameErrorMessage: '',
      email: '',
      emailError: false,
      emailValid: false,
      emailErrorMessage: 'Email Invalide',
      password: '',
      passwordError: false,
      passwordValid: false,
      passwordErrorMessage: '',
    };

    this.emailInput = React.createRef();
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
  }

  validateUsernameInput = async (username) => {
    let validation = { usernameValid: false, usernameError: false };

    if (username !== '') {
      if (username.length < 3) {
        validation = {
          usernameValid: false,
          usernameError: true,
          usernameErrorMessage: "Le nom d'utilisateur doit contenir au moins 3 caractères",
        };
      } else if (username.match(/^[a-zA-Z0-9_.]+$/i) === null) {
        validation = {
          usernameValid: false,
          usernameError: true,
          usernameErrorMessage:
            "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux sauf « _ » et « . »",
        };
      } else {
        const result = await request('auth/check/local/username', 'get', { username });
        if (result.success && !result.data.usernameExists) {
          validation = { usernameValid: true, usernameError: false };
        } else if (result.success) {
          validation = {
            usernameValid: false,
            usernameError: true,
            usernameErrorMessage: "Ce nom d'utilisateur existe déjà",
          };
        } else {
          updateState({ success: false, error: result.error });
        }
      }
    }

    this.setState(validation);
    return validation;
  };

  preValidateUsernameInput = async (username) => {
    if (username.length >= 3 && username.match(/^[a-zA-Z0-9_.]+$/i) !== null) {
      this.setState({ usernameValid: false, usernameError: false });
    }
  };

  validateEmailInput = async (email) => {
    let validation = { emailValid: false, emailError: false };

    if (email !== '') {
      if (email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,13})+$/) === null) {
        validation = {
          emailValid: false,
          emailError: true,
          emailErrorMessage: 'Addresse mail incorrecte',
        };
      } else {
        const result = await request('auth/check/local/email', 'get', { email });
        if (result.success && !result.data.emailExists) {
          validation = { emailValid: true, emailError: false };
        } else if (result.success) {
          validation = {
            emailValid: false,
            emailError: true,
            emailErrorMessage: 'Cette addresse email à déjà été utilisée',
          };
        } else {
          updateState({ success: false, error: result.error });
        }
      }
    }

    this.setState(validation);
    return validation;
  };

  preValidateEmailInput = async (email) => {
    if (email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,13})+$/) !== null) {
      // TODO: Change to emailExists once server is updated
      this.setState({ emailValid: false, emailError: false });
    }
  };

  validatePasswordInput = async (password) => {
    let validation = { passwordValid: false, passwordError: false };

    if (password !== '') {
      if (password.length < 8) {
        validation = {
          passwordValid: false,
          passwordError: true,
          passwordErrorMessage: 'Le mot de passe doit contenir au moins 8 caractères',
        };
      } else if (password.match(/^\S*(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/) === null) {
        validation = {
          passwordValid: false,
          passwordError: true,
          passwordErrorMessage:
            'Le mot de passe doit contenir au moins un chiffre, une minuscule et une majuscule',
        };
      } else {
        validation = { passwordValid: true, passwordError: false };
      }
    }

    this.setState(validation);
    return validation;
  };

  preValidatePasswordInput = async (password) => {
    if (
      password.length >= 8 &&
      password.match(/^\S*(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/) !== null
    ) {
      this.setState({ passwordValid: false, passwordError: false });
    }
  };

  blurInputs = () => {
    this.usernameInput.current.blur();
    this.emailInput.current.blur();
    this.passwordInput.current.blur();
  };

  submit = async () => {
    updateState({ loading: true }); // Do we need this anymore?

    const username = this.usernameInput.current.state.value;
    const email = this.emailInput.current.state.value;
    const password = this.passwordInput.current.state.value;

    const { forward } = this.props;

    const { passwordValid, passwordError } = await this.validatePasswordInput(password);
    const { emailValid, emailError } = await this.validateEmailInput(email);
    const { usernameValid, usernameError } = await this.validateUsernameInput(username);
    if (usernameValid && emailValid && passwordValid) {
      this.blurInputs();
      updateCreationData({ username, email, password });
      forward();
    } else {
      const result = {};
      if (!usernameValid && !usernameError) {
        result.usernameValid = false;
        result.usernameError = true;
        result.usernameErrorMessage = "Nom d'utilisateur requis";
      }
      if (!emailValid && !emailError) {
        result.emailValid = false;
        result.emailError = true;
        result.emailErrorMessage = 'Adresse mail requise';
      }
      if (!passwordValid && !passwordError) {
        result.passwordValid = false;
        result.passwordError = true;
        result.passwordErrorMessage = 'Mot de passe requis';
      }
      this.setState(result);
    }
    updateState({ loading: false }); // Same here: do we need this?
  };

  render() {
    const {
      username,
      usernameError,
      usernameErrorMessage,
      usernameValid,
      email,
      emailError,
      emailErrorMessage,
      emailValid,
      password,
      passwordError,
      passwordErrorMessage,
      passwordValid,
    } = this.state;

    const { theme } = this.props;
    const { colors } = theme;
    const authStyles = getAuthStyles(theme);

    return (
      <View style={authStyles.formContainer}>
        <View style={authStyles.textInputContainer}>
          <TextInput
            ref={this.usernameInput}
            label="Nom d'Utilisateur"
            value={username}
            error={usernameError}
            disableFullscreenUI
            autoCompleteType="username"
            onSubmitEditing={(info) => {
              this.validateUsernameInput(info.nativeEvent.text);
              this.emailInput.current.focus();
            }}
            autoCorrect={false}
            autoFocus
            theme={
              usernameValid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            mode="outlined"
            onEndEditing={(info) => {
              this.validateUsernameInput(info.nativeEvent.text);
            }}
            textContentType="username"
            style={authStyles.textInput}
            onChangeText={(text) => {
              this.setState({ username: text });
              this.preValidateUsernameInput(text);
            }}
          />
          <HelperText type="error" visible={usernameError}>
            {usernameErrorMessage}
          </HelperText>
        </View>
        <View style={authStyles.textInputContainer}>
          <TextInput
            ref={this.emailInput}
            label="Email"
            value={email}
            error={emailError}
            disableFullscreenUI
            keyboardType="email-address"
            autoCompleteType="email"
            autoCapitalize="none"
            onSubmitEditing={(info) => {
              this.validateEmailInput(info.nativeEvent.text);
              this.passwordInput.current.focus();
            }}
            autoCorrect={false}
            theme={
              emailValid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            textContentType="emailAddress"
            mode="outlined"
            onEndEditing={(info) => {
              this.validateEmailInput(info.nativeEvent.text);
            }}
            style={authStyles.textInput}
            onChangeText={(text) => {
              this.setState({ email: text });
              this.preValidateEmailInput(text);
            }}
          />
          <HelperText type="error" visible={emailError}>
            {emailErrorMessage}
          </HelperText>
        </View>
        <View style={authStyles.textInputContainer}>
          <TextInput
            ref={this.passwordInput}
            label="Mot de Passe"
            returnKeyType="go"
            value={password}
            disableFullscreenUI
            error={passwordError}
            mode="outlined"
            autoCorrect={false}
            secureTextEntry
            onSubmitEditing={(info) => {
              this.validatePasswordInput(info.nativeEvent.text);
              this.submit();
            }}
            onEndEditing={(info) => {
              this.validatePasswordInput(info.nativeEvent.text);
            }}
            textContentType="password"
            autoCompleteType="password"
            style={authStyles.textInput}
            onChangeText={(text) => {
              this.setState({ password: text });
              this.preValidatePasswordInput(text);
            }}
            theme={
              passwordValid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
          />
          <HelperText type="error" visible={passwordError}>
            {passwordErrorMessage}
          </HelperText>
        </View>
        <View style={authStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {
              this.submit();
            }}
            style={{ flex: 1 }}
          >
            Suivant
          </Button>
        </View>
      </View>
    );
  }
}

export default withTheme(AuthCreatePageGeneral);

AuthCreatePageGeneral.propTypes = {
  forward: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
