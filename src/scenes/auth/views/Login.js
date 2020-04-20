import React from 'react';
import { View, TouchableWithoutFeedback, Platform } from 'react-native';
import { Text, Button, ProgressBar, TextInput, HelperText, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import getStyles from '../../../styles/Styles';
import getAuthStyles from '../styles/Styles';

import { updateState, login } from '../../../redux/actions/account';

class AuthLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onPagePress: null,
      username: '',
      password: '',
    };
    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
  }

  restart = () => {
    updateState({ error: null, success: null, loading: null });
  };

  setPageOnPress = (func) => {
    this.setState({ onPagePress: func });
  };

  submit = () => {
    const fields = {
      accountInfo: {
        username: this.usernameInput.current.state.value,
        password: this.passwordInput.current.state.value,
      },
      device: {
        type: 'app',
        deviceId: null,
        canNotify: true,
      },
    };
    login(fields);
  };

  render() {
    const { onPagePress, username, password } = this.state;
    const { navigation, reqState, theme } = this.props;

    const { colors } = theme;
    const authStyles = getAuthStyles(theme);
    const styles = getStyles(theme);

    if (reqState.success) {
      return (
        <View style={styles.page}>
          <View style={authStyles.stepIndicatorContainer}>
            <View style={authStyles.centerContainer}>
              <Icon size={50} color={colors.valid} name="account-check-outline" />
              <Text style={authStyles.title}>Connexion réussie</Text>
            </View>
          </View>
          <View style={authStyles.formContainer}>
            <View style={authStyles.buttonContainer}>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() =>
                  navigation.navigate('Main', {
                    screen: 'Home1',
                    params: { screen: 'Home2', params: { screen: 'Article' } },
                  })
                }
                style={{ flex: 1 }}
              >
                Suivant
              </Button>
            </View>
          </View>
        </View>
      );
    }

    if (reqState.success === false) {
      return (
        <View style={styles.page}>
          <View style={authStyles.stepIndicatorContainer}>
            <View style={authStyles.centerContainer}>
              <Icon size={50} color={colors.text} name="account-remove-outline" />
              <Text style={authStyles.title}>Erreur lors de la connexion</Text>
              <Text>
                Veuillez vérifier votre connexion internet, réessayer en vérifiant que les données
                soient correctes ou signaler un bug depuis le menu principal
              </Text>
              <Text>
                Erreur:{' '}
                {reqState.error.message ||
                  reqState.error.value ||
                  reqState.error.extraMessage ||
                  'Inconnu'}
              </Text>
            </View>
          </View>
          <View style={authStyles.formContainer}>
            <View style={authStyles.buttonContainer}>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => this.restart()}
                style={{ flex: 1 }}
              >
                Recommencer
              </Button>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.page}>
        <TouchableWithoutFeedback onPress={onPagePress} style={{ height: '100%', width: '100%' }}>
          <View style={{ flex: 1 }}>
            {reqState.loading && <ProgressBar indeterminate />}
            <View style={authStyles.stepIndicatorContainer}>
              <View style={authStyles.centerContainer}>
                <Text style={authStyles.title}>Se connecter</Text>
              </View>
            </View>
            <View style={authStyles.formContainer}>
              <View style={authStyles.textInputContainer}>
                <TextInput
                  ref={this.usernameInput}
                  label="Nom d'utilisateur ou addresse mail"
                  value={username}
                  autoCompleteType="username"
                  onSubmitEditing={() => {
                    this.passwordInput.current.focus();
                  }}
                  autoCorrect={false}
                  autoFocus
                  error={reqState.incorrect}
                  mode="outlined"
                  textContentType="username"
                  style={authStyles.textInput}
                  onChangeText={(text) => {
                    this.setState({ username: text });
                  }}
                />
                <HelperText type="error" visible={false} />
                {/* Because spacing */}
              </View>
              <View style={authStyles.textInputContainer}>
                <TextInput
                  ref={this.passwordInput}
                  label="Mot de Passe"
                  value={password}
                  mode="outlined"
                  error={reqState.incorrect}
                  autoCorrect={false}
                  secureTextEntry
                  onSubmitEditing={() => {
                    this.submit();
                  }}
                  textContentType="password"
                  autoCompleteType="password"
                  style={authStyles.textInput}
                  onChangeText={(text) => {
                    this.setState({ password: text });
                  }}
                />
                <HelperText type="error" visible={reqState.incorrect}>
                  Le nom d&apos;utilisateur ou le mot de passe est incorrect
                </HelperText>
              </View>
              <View style={authStyles.buttonContainer}>
                <Button
                  mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                  uppercase={Platform.OS !== 'ios'}
                  onPress={() => this.submit()}
                  style={{ flex: 1 }}
                >
                  Se connecter
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { account } = state;
  return { reqState: account.state };
};

export default connect(mapStateToProps)(withTheme(AuthLogin));

AuthLogin.defaultProps = {
  reqState: {
    error: null,
    success: null,
    loading: false,
    incorrect: null,
  },
};

AuthLogin.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  reqState: PropTypes.shape({
    error: PropTypes.any,
    success: PropTypes.bool,
    loading: PropTypes.bool,
    incorrect: PropTypes.bool,
  }),
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
