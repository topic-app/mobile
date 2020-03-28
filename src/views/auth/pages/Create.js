import React from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import PropTypes from 'prop-types';

import { styles, colors } from '../../../styles/Styles';
import { theme } from '../../../styles/Theme';
import { authStyles } from '../styles/Styles';

class AuthCreateScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: false,
      usernameValid: false,
      userNameErrorMessage: '',
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
      if (username.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) !== null && username.length >= 3) {
        this.setState({ usernameValid: true, usernameError: false });
      } else {
        this.setState({ usernameValid: false, usernameError: true });
      }
    } else {
      this.setState({ usernameValid: false, usernameError: false });
    }
  };

  validateEmailInput = () => {
    const { email } = this.state;
    if (email !== '') {
      if (email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,13})+$/) !== null) {
        this.setState({ emailValid: true, emailError: false });
      } else {
        this.setState({ emailValid: false, emailError: true });
      }
    } else {
      this.setState({ emailValid: false, emailError: false });
    }
  };

  render() {
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

    return (
      <View style={styles.page}>
        <View style={authStyles.centerContainer}>
          <Text style={authStyles.title}>Créer un Compte</Text>
          <TextInput
            label="Nom d'Utilisateur"
            value={username}
            error={usernameError}
            theme={
              usernameValid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            mode="outlined"
            onEndEditing={this.validateUsernameInput}
            textContentType="username"
            style={authStyles.textInput}
            onChangeText={(text) => this.setState({ username: text })}
          />
          <TextInput
            label="Email"
            value={email}
            error={emailError}
            theme={
              emailValid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            textContentType="emailAddress"
            mode="outlined"
            onEndEditing={this.validateEmailInput}
            style={authStyles.textInput}
            onChangeText={(text) => this.setState({ email: text })}
          />
          <TextInput
            label="Mot de Passe"
            value={password}
            error={passwordError}
            mode="outlined"
            secureTextEntry
            textContentType="password"
            style={authStyles.textInput}
            onChangeText={(text) => this.setState({ password: text })}
          />
        </View>
      </View>
    );
  }
}

export default AuthCreateScreen;

AuthCreateScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
