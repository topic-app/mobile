import React from 'react';
import { View, Platform } from 'react-native';
import { Text, TextInput, HelperText, Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import { updateCreationData, updateState } from '../../../redux/actions/account';

import { styles, colors } from '../../../styles/Styles';
import { theme } from '../../../styles/Theme';
import { authStyles } from '../styles/Styles';
import request from '../../../utils/request';

class AuthCreatePageGeneral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: null,
      usernameErrorMessage: '',
      email: '',
      emailError: null,
      emailErrorMessage: 'Email Invalide',
      password: '', // Trust me, I'm a security specialist, I know what I'm doing.
      passwordError: null,
      passwordErrorMessage: '',
    };
    this.emailInput = React.createRef();
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
  }

  validateUsername = (username = this.state.username) => {
    const result = { error: false };
    if (username !== '') {
      if (username.length < 3) {
        result.error = true;
        result.message = "Le nom d'utilisateur doit contenir au moins 3 caractères";
      } else if (username.match(/^[a-zA-Z0-9_.]+$/i) === null) {
        result.error = true;
        result.message =
          "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux sauf « _ » et « . »";
      } else {
        request('auth/check/local/username', 'get', { username })
          .then((requestResult) => {
            if (!requestResult.success) {
              updateState({ success: false, error: requestResult.error });
            } else {
              result.error = true;
              result.message = "Ce nom d'utilisateur existe déjà";
            }
          })
          .catch((err) => {
            updateState({ success: false, error: err });
          });
      }
    } else {
      result.error = null;
    }
    return result;
  };

  validateEmail = (email = this.state.email) => {
    const result = { error: false };
    if (email !== '') {
      if (email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,13})+$/) === null) {
        result.error = true;
        result.message = "L'addresse mail n'est pas valide";
      } else {
        request('auth/check/local/email', 'get', { email })
          .then((requestResult) => {
            if (!requestResult.success) {
              updateState({ success: false, error: requestResult.error });
            } else {
              result.error = true;
              result.message = 'Il existe déjà un compte avec cet email';
            }
          })
          .catch((err) => {
            updateState({ success: false, error: err });
          });
      }
    } else {
      result.error = null;
    }
    return result;
  };

  validatePassword = (password = this.state.password) => {
    const result = { error: false };
    if (password !== '') {
      if (password.length < 8) {
        result.error = true;
        result.message = 'Le mot de passe doit contenir au moins 8 caractères';
      } else if (password.match(/^\S*(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/) === null) {
        result.error = true;
        result.message =
          'Le mot de passe doit contenir au moins un chiffre, une minuscule et une majuscule';
      }
    } else {
      result.error = null;
    }
    return result;
  };

  handleInputState = (type, result) => {
    switch (type) {
      case 'username':
        if (result.error) {
          this.setState({
            usernameError: true,
            usernameErrorMessage: result.message,
          });
        } else if (result.error === null) {
          // If username is empty
          this.setState({ usernameError: null });
        } else {
          this.setState({ usernameError: false });
        }
        break;
      case 'email':
        if (result.error) {
          this.setState({
            emailError: true,
            emailErrorMessage: result.message,
          });
        } else if (result.error === null) {
          this.setState({ emailError: null });
        } else {
          this.setState({ emailError: false });
        }
        break;
      case 'password':
        if (result.error) {
          this.setState({
            passwordError: true,
            passwordErrorMessage: result.message,
          });
        } else if (result.error === null) {
          this.setState({ passwordError: null });
        } else {
          this.setState({ passwordError: false });
        }
        break;
      default:
        console.warn('Unknown type encountered:', type);
        break;
    }
  };

  submit = async () => {
    updateState({ loading: true });
    const { username, email, password } = this.state;
    const { forward } = this.props;

    await this.usernameInput.current.blur();
    await this.emailInput.current.blur();
    await this.passwordInput.current.blur();
    const usernameResult = this.validateUsername(username);
    const emailResult = this.validateEmail(email);
    const passwordResult = this.validatePassword(password);
    if (!usernameResult.error && !emailResult.error && !passwordResult.error) {
      updateCreationData({ username, email, password });
      forward();
    } else {
      if (usernameResult.error === null) {
        this.setState({
          usernameError: true,
          usernameErrorMessage: "Nom d'utilisateur requis",
        });
      }
      if (emailResult.error === null) {
        this.setState({
          emailError: true,
          emailErrorMessage: 'Addresse email requise',
        });
      }
      if (passwordResult.error === null) {
        this.setState({
          passwordError: true,
          passwordErrorMessage: 'Mot de passe requis',
        });
      }
    }
    updateState({ loading: false });
  };

  render() {
    const {
      username,
      usernameError,
      usernameErrorMessage,
      email,
      emailError,
      emailErrorMessage,
      password,
      passwordError,
      passwordErrorMessage,
    } = this.state;

    return (
      <View style={authStyles.formContainer}>
        <View style={authStyles.textInputContainer}>
          <TextInput
            ref={this.usernameInput}
            label="Nom d'Utilisateur"
            mode="outlined"
            value={username}
            error={usernameError}
            textContentType="username"
            autoCompleteType="username"
            autoCorrect={false}
            autoFocus
            theme={
              usernameError === false // Note: has to be strictly false, null is reserved for an empty input
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            style={authStyles.textInput}
            onChangeText={(text) => {
              this.setState({ username: text });
              const result = this.validateUsername(username);
              if (result.error === false) {
                this.setState({ usernameError: false });
              }
            }}
            onEndEditing={() => {
              const { username: usernameText } = this.state;
              this.handleInputState('username', this.validateUsername(usernameText));
            }}
            onSubmitEditing={({ nativeEvent: { text } }) => {
              this.handleInputState('username', this.validateUsername(text));
              this.emailInput.current.focus();
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
            mode="outlined"
            value={email}
            error={emailError}
            textContentType="emailAddress"
            autoCompleteType="email"
            autoCorrect={false}
            theme={
              emailError === false
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            style={authStyles.textInput}
            onChangeText={(text) => {
              this.setState({ email: text });
              const result = this.validateEmail(email);
              if (result.error === false) {
                this.setState({ emailError: false });
              }
            }}
            onEndEditing={() => {
              const { email: emailText } = this.state;
              this.handleInputState('email', this.validateEmail(emailText));
            }}
            onSubmitEditing={({ nativeEvent: { text } }) => {
              this.handleInputState('email', this.validateEmail(text));
              this.passwordInput.current.focus();
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
            mode="outlined"
            value={password}
            error={passwordError}
            textContentType="password"
            autoCompleteType="password"
            autoCorrect={false}
            secureTextEntry
            theme={
              passwordError === false
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            style={authStyles.textInput}
            onChangeText={(text) => {
              this.setState({ password: text });
              const result = this.validatePassword(password);
              if (result.error === false) {
                this.setState({ passwordError: false });
              }
            }}
            onEndEditing={() => {
              const { password: passwordText } = this.state;
              this.handleInputState('password', this.validatePassword(passwordText));
            }}
            onSubmitEditing={({ nativeEvent: { text } }) => {
              this.handleInputState('password', this.validatePassword(text));
              this.submit();
            }}
          />
          <HelperText type="error" visible={passwordError}>
            {passwordErrorMessage}
          </HelperText>
        </View>
        <View style={authStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={this.submit}
            style={{ flex: 1 }}
          >
            Suivant
          </Button>
        </View>
      </View>
    );
  }
}

export default AuthCreatePageGeneral;

AuthCreatePageGeneral.propTypes = {
  forward: PropTypes.func.isRequired,
};
