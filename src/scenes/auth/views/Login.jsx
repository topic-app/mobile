import React from 'react';
import { View, TouchableWithoutFeedback, Platform } from 'react-native';
import { Text, Button, ProgressBar, TextInput, HelperText, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import getStyles from '@styles/Styles';
import { updateState, login } from '@redux/actions/account';
import getAuthStyles from '../styles/Styles';

function AuthLogin({ navigation, reqState }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const usernameInput = React.createRef();
  const passwordInput = React.createRef();

  const restart = () => updateState({ error: null, success: null, loading: null });

  const submit = () => {
    const fields = {
      accountInfo: {
        username: usernameInput.current.state.value,
        password: passwordInput.current.state.value,
      },
      device: {
        type: 'app',
        deviceId: null,
        canNotify: true,
      },
    };
    login(fields);
  };

  const theme = useTheme();
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
              onPress={() => restart()}
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
      {reqState.loading && <ProgressBar indeterminate />}
      <View style={authStyles.stepIndicatorContainer}>
        <View style={authStyles.centerContainer}>
          <Text style={authStyles.title}>Se connecter</Text>
        </View>
      </View>
      <View style={authStyles.formContainer}>
        <View style={authStyles.textInputContainer}>
          <TextInput
            ref={usernameInput}
            label="Nom d'utilisateur ou addresse mail"
            value={username}
            autoCompleteType="username"
            onSubmitEditing={() => passwordInput.current.focus()}
            autoCorrect={false}
            autoFocus
            error={reqState.incorrect}
            mode="outlined"
            textContentType="username"
            style={authStyles.textInput}
            onChangeText={(text) => setUsername(text)}
          />
          <HelperText type="error" visible={false} />
          {/* Because spacing */}
        </View>
        <View style={authStyles.textInputContainer}>
          <TextInput
            ref={passwordInput}
            label="Mot de Passe"
            value={password}
            mode="outlined"
            error={reqState.incorrect}
            autoCorrect={false}
            secureTextEntry
            onSubmitEditing={() => submit()}
            textContentType="password"
            autoCompleteType="password"
            style={authStyles.textInput}
            onChangeText={(text) => setPassword(text)}
          />
          <HelperText type="error" visible={reqState.incorrect}>
            Le nom d&apos;utilisateur ou le mot de passe est incorrect
          </HelperText>
        </View>
        <View style={authStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => submit()}
            style={{ flex: 1 }}
          >
            Se connecter
          </Button>
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { account } = state;
  return { reqState: account.state };
};

export default connect(mapStateToProps)(AuthLogin);

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
};
