import React from 'react';
import { View } from 'react-native';
import { Text, TextInput, HelperText, Button, Snackbar } from 'react-native-paper';
import PropTypes from 'prop-types';

import { styles, colors } from '../../../styles/Styles';
import { theme } from '../../../styles/Theme';
import { authStyles } from '../styles/Styles';

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
    console.log(username.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) === null)
    if (username !== '') {
      if (username.length < 3) {
        this.setState({ usernameValid: false, usernameError: true, usernameErrorMessage: "Le nom d'utilisateur doit contenir au moins 3 caractères" });
      } else if (username.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) === null) {
        this.setState({ usernameValid: false, usernameError: true, usernameErrorMessage: "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux"})
      } else {
        this.setState({ usernameValid: true, usernameError: false, usernameErrorMessage: "" });
      }
    } else {
      this.setState({ usernameValid: false, usernameError: false });
    }
  };

  validateEmailInput = () => {
    const { email } = this.state;
    if (email !== '') {
      if (email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,13})+$/) === null) {
        this.setState({ emailValid: false, emailError: true, emailErrorMessage: "L'addresse mail n'est pas valide" });
      } else {
        this.setState({ emailValid: true, emailError: false });
      }
    } else {
      this.setState({ emailValid: false, emailError: false });
    }
  };

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

  submit = () => {
    const {
      usernameError,
      usernameValid,
      emailError,
      emailValid,
      passwordError,
      passwordValid,
    } = this.state;

    const {
      forward
    } = this.props;

    this.usernameInput.blur();
    this.emailInput.blur();
    this.passwordInput.blur();
    this.validatePasswordInput();
    this.validateEmailInput();
    this.validateUsernameInput();
    if (usernameValid && emailValid && passwordValid) {
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
                if (usernameError) {
                  this.validateUsernameInput();
                }
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
                if (emailError) {
                  this.validateEmailInput();
                }
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
              }}
              onEndEditing={this.validatePasswordInput}
              textContentType="password"
              autoCompleteType="password"
              style={authStyles.textInput}
              onChangeText={(text) => {
                this.setState({ password: text });
                if (passwordError) {
                  this.validatePasswordInput();
                }
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
              mode="contained"
              onPress={() => this.submit()}
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
