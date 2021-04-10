import { Formik } from 'formik';
import React from 'react';
import {
  View,
  ScrollView,
  Platform,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Text, Button, TextInput, HelperText, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { TranslucentStatusBar, PlatformBackButton, Illustration } from '@components';
import { fetchAccount, login } from '@redux/actions/data/account';
import { AccountRequestState, State } from '@ts/types';
import { Errors, trackEvent, getApiDevice } from '@utils';

import type { AuthScreenNavigationProp } from '.';
import getStyles from './styles';

type AuthLoginProps = {
  navigation: AuthScreenNavigationProp<'Login'>;
  reqState: AccountRequestState;
};

const AuthLogin: React.FC<AuthLoginProps> = ({
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
  const usernameInput = React.createRef<RNTextInput>();
  const passwordInput = React.createRef<RNTextInput>();

  const theme = useTheme();
  const styles = getStyles(theme);

  React.useEffect(() => trackEvent('auth:login-start'), []);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Nom d'utilisateur requis"),
    password: Yup.string().required('Mot de passe requis'),
  });

  const handleLogin = async ({ username, password }: { username: string; password: string }) => {
    trackEvent('auth:login-request');
    const fields = {
      accountInfo: {
        username,
        password,
      },
      device: await getApiDevice(),
    };
    let didLogin = false;
    try {
      didLogin = await login(fields);
    } catch (error) {
      Errors.showPopup({
        type: 'axios',
        what: 'la connexion',
        error,
        retry: () => handleLogin({ username, password }),
      });
    }
    if (didLogin) {
      trackEvent('auth:login-success');
      if (Platform.OS === 'web') {
        await fetchAccount();
        setTimeout(() => window.location.replace('/'), 200); // HACK : Because otherwise it doesnt redirect properly
      } else {
        navigation.navigate('Root', {
          screen: 'Main',
          params: {
            screen: 'Home1',
            params: { screen: 'Home2', params: { screen: 'Article' } },
          },
        });
      }
    } else {
      trackEvent('auth:login-wrong');
    }
  };

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <PlatformBackButton onPress={navigation.goBack} />
            <View style={styles.stepIndicatorContainer}>
              <View style={styles.centerIllustrationContainer}>
                <Illustration
                  name={Platform.OS === 'web' ? 'topic-icon-text' : 'auth-login'}
                  height={200}
                  width={200}
                />
                <Text style={styles.title}>Se connecter</Text>
              </View>
            </View>
            <View style={styles.formContainer}>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
                validateOnMount={false}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <View>
                    <TextInput
                      ref={usernameInput}
                      label="Nom d'utilisateur ou adresse mail"
                      accessibilityLabel="Nom d'utilisateur ou adresse mail"
                      value={values.username}
                      error={(!!errors.username || !!reqState.login.incorrect) && touched.username} // `!!` transforms it into a boolean
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      onSubmitEditing={() => passwordInput.current?.focus()}
                      style={styles.textInput}
                      mode="outlined"
                      autoCompleteType="username"
                      autoCapitalize="none"
                      textContentType="username"
                      autoCorrect={false}
                      autoFocus
                    />
                    <HelperText type="error" visible={!!errors.username && touched.username}>
                      {errors.username}
                    </HelperText>
                    <TextInput
                      ref={passwordInput}
                      label="Mot de passe"
                      accessibilityLabel="Mot de passe"
                      value={values.password}
                      error={(!!errors.password || !!reqState.login.incorrect) && touched.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      onSubmitEditing={() => handleSubmit()}
                      style={styles.textInput}
                      mode="outlined"
                      secureTextEntry
                      autoCapitalize="none"
                      textContentType="password"
                      autoCompleteType="password"
                      autoCorrect={false}
                    />
                    <HelperText
                      type="error"
                      visible={
                        (!!errors.password || !!reqState.login.incorrect) && touched.password
                      }
                    >
                      {errors.password}
                      {!errors.password
                        ? "Le nom d'utilisateur ou le mot de passe est incorrect"
                        : null}
                    </HelperText>

                    <View style={styles.buttonContainer}>
                      <Button
                        mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                        uppercase={Platform.OS !== 'ios'}
                        onPress={handleSubmit}
                        style={{ flex: 1 }}
                        loading={reqState.login.loading}
                      >
                        Se connecter
                      </Button>
                    </View>
                  </View>
                )}
              </Formik>
              <View style={{ alignItems: 'flex-end', marginTop: 20 }}>
                <Text>
                  <Text style={styles.link} onPress={() => navigation.navigate('Create')}>
                    Créer un compte
                  </Text>
                  {'  -  '}
                  <Text style={styles.link} onPress={() => navigation.navigate('ResetPassword')}>
                    Mot de passe oublié
                  </Text>
                </Text>
              </View>
              {Platform.OS === 'web' && (
                <View>
                  <View style={{ alignItems: 'center', marginTop: 100 }}>
                    <Text>
                      <Text
                        style={styles.link}
                        onPress={() =>
                          navigation.push('Root', {
                            screen: 'Main',
                            params: {
                              screen: 'More',
                              params: {
                                screen: 'About',
                                params: { screen: 'Legal', params: { page: 'mentions' } },
                              },
                            },
                          })
                        }
                      >
                        Mentions légales
                      </Text>
                      {' - '}
                      <Text
                        style={styles.link}
                        onPress={() =>
                          navigation.push('Root', {
                            screen: 'Main',
                            params: {
                              screen: 'More',
                              params: {
                                screen: 'About',
                                params: { screen: 'Legal', params: { page: 'conditions' } },
                              },
                            },
                          })
                        }
                      >
                        Conditions d&apos;utilisation
                      </Text>
                      {' - '}
                      <Text
                        style={styles.link}
                        onPress={() =>
                          navigation.push('Root', {
                            screen: 'Main',
                            params: {
                              screen: 'More',
                              params: {
                                screen: 'About',
                                params: { screen: 'Legal', params: { page: 'confidentialite' } },
                              },
                            },
                          })
                        }
                      >
                        Politique de vie privée
                      </Text>
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { reqState: account.state };
};

export default connect(mapStateToProps)(AuthLogin);
