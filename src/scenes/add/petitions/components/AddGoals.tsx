import React from 'react';
import { View, Platform } from 'react-native';
import { TextInput, HelperText, Button, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

import { updateCreationData, updateState } from '@redux/actions/data/account';
import { request } from '@utils/index';
import getAuthStyles from '../styles/Styles';

class AuthCreatePageGeneral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      titleError: false,
      titleValid: false,
      titleErrorMessage: '',
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
    this.titleInput = React.createRef();
    this.passwordInput = React.createRef();
  }

  validateTitleInput = async (title) => {
    let validation = { titleValid: false, titleError: false };

    if (title !== '') {
      if (title.length < 20) {
        validation = {
          titleValid: false,
          titleError: true,
          titleErrorMessage: 'Le titre doit contenir au moins 20 caractères',
        };
      } else {
        validation = {
          titleValid: false,
          titleError: true,
          titleErrorMessage: "Ce nom d'utilisateur existe déjà",
        };
      }
    }

    this.setState(validation);
    return validation;
  };

  preValidateTitleInput = async (title) => {
    if (title.length >= 3 && title.match(/^[a-zA-Z0-9_.]+$/i) !== null) {
      this.setState({ titleValid: false, titleError: false });
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
            emailErrorMessage: 'Cette adresse email à déjà été utilisée',
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
    this.titleInput.current.blur();
    this.emailInput.current.blur();
    this.passwordInput.current.blur();
  };

  submit = async () => {
    updateState({ loading: true }); // Do we need this anymore?

    const title = this.titleInput.current.state.value;
    const email = this.emailInput.current.state.value;
    const password = this.passwordInput.current.state.value;

    const { forward } = this.props;

    const { passwordValid, passwordError } = await this.validatePasswordInput(password);
    const { emailValid, emailError } = await this.validateEmailInput(email);
    const { titleValid, titleError } = await this.validateTitleInput(title);
    if (titleValid && emailValid && passwordValid) {
      this.blurInputs();
      updateCreationData({ title, email, password });
      forward();
    } else {
      const result = {};
      if (!titleValid && !titleError) {
        result.titleValid = false;
        result.titleError = true;
        result.titleErrorMessage = "Nom d'utilisateur requis";
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
      title,
      titleError,
      titleErrorMessage,
      titleValid,
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
            ref={this.titleInput}
            label="Nom d'Utilisateur"
            value={title}
            error={titleError}
            disableFullscreenUI
            onSubmitEditing={(info) => {
              this.validateTitleInput(info.nativeEvent.text);
              this.emailInput.current.focus();
            }}
            autoCorrect={false}
            autoFocus
            theme={
              titleValid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            mode="outlined"
            onEndEditing={(info) => {
              this.validateTitleInput(info.nativeEvent.text);
            }}
            style={authStyles.textInput}
            onChangeText={(text) => {
              this.setState({ title: text });
              this.preValidateTitleInput(text);
            }}
          />
          <HelperText type="error" visible={titleError}>
            {titleErrorMessage}
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
