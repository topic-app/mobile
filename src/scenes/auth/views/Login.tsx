import React from 'react';
import { View, ScrollView, Platform, TextInput as RNTextInput } from 'react-native';
import { Text, Button, ProgressBar, TextInput, HelperText } from 'react-native-paper';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';

import { AccountRequestState, State } from '@ts/types';
import {
  TranslucentStatusBar,
  ErrorMessage,
  PlatformBackButton,
  Illustration,
  SafeAreaView,
} from '@components/index';
import { useTheme, logger } from '@utils/index';
import getStyles from '@styles/Styles';
import { login } from '@redux/actions/data/account';

import type { AuthStackParams } from '../index';
import getAuthStyles from '../styles/Styles';

type Props = {
  navigation: StackNavigationProp<AuthStackParams, 'Login'>;
  reqState: AccountRequestState;
};

const AuthLogin: React.FC<Props> = ({
  navigation,
  reqState = {
    login: {
      error: null,
      success: null,
      loading: false,
      incorrect: null,
    },
  },
}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const usernameInput = React.createRef<RNTextInput>();
  const passwordInput = React.createRef<RNTextInput>();

  const submit = () => {
    const fields = {
      accountInfo: {
        username,
        password,
      },
      device: {
        type: 'app',
        deviceId: null,
        canNotify: true,
      },
    };
    login(fields)
      .then(() => {
        navigation.navigate('Main', {
          screen: 'Home1',
          params: { screen: 'Home2', params: { screen: 'Article' } },
        });
      })
      .catch((e) => logger.error(e));
  };

  const theme = useTheme();
  const { colors } = theme;
  const authStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        {reqState.login.loading ? <ProgressBar indeterminate /> : <View style={{ height: 4 }} />}
        {reqState.login.success === false && (
          <ErrorMessage
            error={reqState.login.error}
            strings={{
              what: 'la connexion',
              contentSingular: 'Le compte',
            }}
            type="axios"
            retry={submit}
          />
        )}

        <ScrollView keyboardShouldPersistTaps="handled">
          <PlatformBackButton onPress={navigation.goBack} />
          <View style={authStyles.stepIndicatorContainer}>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="auth-login" height={200} width={200} />
              <Text style={authStyles.title}>Se connecter</Text>
            </View>
          </View>
          <View style={authStyles.formContainer}>
            <View style={authStyles.textInputContainer}>
              <TextInput
                ref={usernameInput}
                label="Nom d'utilisateur ou adresse mail"
                value={username}
                autoCompleteType="username"
                onSubmitEditing={() => passwordInput.current?.focus()}
                autoCorrect={false}
                autoFocus
                error={!!reqState.login.incorrect} // `!!` transforms it into a boolean
                mode="outlined"
                textContentType="username"
                style={authStyles.textInput}
                onChangeText={setUsername}
              />
              <HelperText type="error" visible={false} />
              {/* Because spacing */}
            </View>
            <View style={authStyles.textInputContainer}>
              <TextInput
                ref={passwordInput}
                label="Mot de passe"
                value={password}
                mode="outlined"
                error={!!reqState.login.incorrect}
                autoCorrect={false}
                secureTextEntry
                autoCapitalize="none"
                onSubmitEditing={() => submit()}
                textContentType="password"
                autoCompleteType="password"
                style={authStyles.textInput}
                onChangeText={setPassword}
              />
              <HelperText type="error" visible={reqState.login.incorrect}>
                Le nom d&apos;utilisateur ou le mot de passe est incorrect
              </HelperText>
            </View>
            <View style={authStyles.buttonContainer}>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={submit}
                style={{ flex: 1 }}
              >
                Se connecter
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { reqState: account.state };
};

export default connect(mapStateToProps)(AuthLogin);
