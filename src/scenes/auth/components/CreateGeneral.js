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
      usernameError: false,
      usernameValid: false,
      usernameErrorMessage: '',
      email: '',
      emailError: false,
      emailValid: false,
      emailErrorMessage: 'Email Invalide',
      password: '', // Trust me, I'm a security specialist, I know what I'm doing.
      passwordError: false,
      passwordValid: false,
      passwordErrorMessage: '',
    };
    this.emailRef = React.createRef();
  }

  validateUsernameInput = () => {
    const { username } = this.state;
    if (username !== '') {
      if (username.length < 3) {
        this.setState({ usernameValid: false, usernameError: true, usernameErrorMessage: "Le nom d'utilisateur doit contenir au moins 3 caractères" });
      } else if (username.match(/^[a-zA-Z0-9_.]+$/i) === null) {
        this.setState({ usernameValid: false, usernameError: true, usernameErrorMessage: "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux sauf « _ » et « . »"})
      } else {
        request('auth/check/local/username', 'get', { username }).then((result) => {
          if (result.success && !result.data.usernameExists) {
            this.setState({ usernameValid: true, usernameError: false, usernameErrorMessage: "" });
          } else if (!result.success) {
            updateState({ success: false, error: result.error })
          } else {
            this.setState({ usernameValid: false, usernameError: true, usernameErrorMessage: "Ce nom d'utilisateur existe déjà" });
          }
        }).catch((err) => {
          updateState({ success: false, error: err })
        });
      }
    } else {
      this.setState({ usernameValid: false, usernameError: false });
    }
  };

  preValidateUsernameInput = () => {
    const { username } = this.state;
    request('auth/check/local/username', 'get', { username }).then((result) => {
      if (username.length >= 3 && username.match(/^[a-zA-Z0-9_.]+$/i) !== null && result.success && !result.data.usernameExists) {
        this.setState({ usernameValid: true, usernameError: false });
      }
    }).catch(() => {});
  }

  validateEmailInput = () => {
    const { email } = this.state;
    if (email !== '') {
      if (email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,13})+$/) === null) {
        this.setState({ emailValid: false, emailError: true, emailErrorMessage: "L'addresse mail n'est pas valide" });
      } else {
        request('auth/check/local/email', 'get', { email }).then((result) => {
          if (result.success && !result.data.usernameExists) {
            this.setState({ emailValid: true, emailError: false, emailErrorMessage: "" });
          } else if (!result.success) {
            updateState({ success: false, error: result.error })
          } else {
            this.setState({ emailValid: false, emailError: true, emailErrorMessage: "Il existe déjà un compte avec cet email" });
          }
        }).catch((err) => {
          updateState({ success: false, error: err })
        });
      }
    } else {
      this.setState({ emailValid: false, emailError: false });
    }
  };

  preValidateEmailInput = () => {
    const { email } = this.state;
    request('auth/check/local/username', 'get', { email }).then((result) => {
      if (email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,13})+$/) !== null && result.success && result.data.usernameExists) { // TODO: Change to emailExists once server is updated
        this.setState({ emailValid: true, emailError: false });
      }
    }).catch(() => {});
  }

  validatePasswordInput = () => {
    const { password } = this.state;
    if (password !== '') {
      if (password.length < 8) {
        this.setState({ passwordValid: false, passwordError: true, passwordErrorMessage: "Le mot de passe doit contenir au moins 8 caractères" });
      } else if (password.match(/^\S*(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/) === null) {
        this.setState({ passwordValid: false, passwordError: true, passwordErrorMessage: "Le mot de passe doit contenir au moins un chiffre, une minuscule et une majuscule" });
      } else {
        this.setState({ passwordValid: true, passwordError: false });
      }
    } else {
      this.setState({ passwordValid: false, passwordError: false });
    }
  };

  preValidatePasswordInput = () => {
    const { password } = this.state;
    if (password.length >= 8 && password.match(/^\S*(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/) !== null) {
      this.setState({ passwordValid: true, passwordError: false })
    }
  }

  submit = async() => {
    updateState({ loading: true })
    const {
      username,
      usernameError,
      usernameValid,
      email,
      emailError,
      emailValid,
      password,
      passwordError,
      passwordValid,
    } = this.state;

    const {
      forward
    } = this.props;

    await this.usernameInput.blur();
    await this.emailInput.blur();
    await this.passwordInput.blur();
    await this.validatePasswordInput();
    await this.validateEmailInput();
    await this.validateUsernameInput();
    if (usernameValid && emailValid && passwordValid) {
      updateCreationData({ username, email, password })
      forward()
    } else {
      if (!usernameValid && !usernameError) {
        this.setState({ usernameValid: false, usernameError: true, usernameErrorMessage: "Nom d'utilisateur requis"});
      } if (!emailValid && !emailError) {
        this.setState({ emailValid: false, emailError: true, emailErrorMessage: "Addresse email requise"});
      } if (!passwordValid && !passwordError) {
        this.setState({ passwordValid: false, passwordError: true, passwordErrorMessage: "Mot de passe requis"});
      }
    }
    updateState({ loading: false })
  }

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

    return (
        <View style={authStyles.formContainer}>
          <View style={authStyles.textInputContainer}>
            <TextInput
              ref={usernameInput => {
                this.usernameInput = usernameInput
              }}
              label="Nom d'Utilisateur"
              value={username}
              error={usernameError}
              autoCompleteType="username"
              onSubmitEditing={() => {
                this.validateUsernameInput();
                this.emailInput.focus();
              }}
              autoCorrect={false}
              autoFocus
              theme={
                usernameValid
                  ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                  : theme
              }
              mode="outlined"
              onEndEditing={this.validateUsernameInput}
              textContentType="username"
              style={authStyles.textInput}
              onChangeText={(text) => {
                this.setState({ username: text });
                this.preValidateUsernameInput();
              }}
            />
            <HelperText
              type="error"
              visible={usernameError}
            >
              { usernameErrorMessage }
            </HelperText>
          </View>
          <View style={authStyles.textInputContainer}>
            <TextInput
              ref={emailInput => {
                this.emailInput = emailInput
              }}
              label="Email"
              value={email}
              error={emailError}
              autoCompleteType="email"
              onSubmitEditing={() => {
                this.validateEmailInput();
                this.passwordInput.focus();
              }}
              autoCorrect={false}
              theme={
                emailValid
                  ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                  : theme
              }
              textContentType="emailAddress"
              mode="outlined"
              onEndEditing={this.validateEmailInput}
              style={authStyles.textInput}
              onChangeText={(text) => {
                this.setState({ email: text });
                this.preValidateEmailInput();
              }}
            />
            <HelperText
              type="error"
              visible={emailError}
            >
              { emailErrorMessage }
            </HelperText>
          </View>
          <View style={authStyles.textInputContainer}>
            <TextInput
              ref={passwordInput => {
                this.passwordInput = passwordInput
              }}
              label="Mot de Passe"
              value={password}
              error={passwordError}
              mode="outlined"
              autoCorrect={false}
              secureTextEntry
              onSubmitEditing={() => {
                this.validatePasswordInput();
                this.submit()
                // this.submit() // TEMP: Because validation needs to be redone
              }}
              onEndEditing={this.validatePasswordInput}
              textContentType="password"
              autoCompleteType="password"
              style={authStyles.textInput}
              onChangeText={(text) => {
                this.setState({ password: text });
                this.preValidatePasswordInput();
              }}
              theme={
                passwordValid
                  ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                  : theme
              }
            />
            <HelperText
              type="error"
              visible={passwordError}
            >
              { passwordErrorMessage }
            </HelperText>
          </View>
          <View style={authStyles.buttonContainer}>
            <Button
              mode={Platform.OS !== "ios" ? "contained": "outlined"}
              uppercase={Platform.OS !== "ios"}
              onPress={() => {this.submit();}}
              style={{flex: 1}}
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
