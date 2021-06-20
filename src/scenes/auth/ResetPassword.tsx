import { Formik } from 'formik';
import React from 'react';
import {
  View,
  ScrollView,
  Platform,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Text, Button, ProgressBar, TextInput, HelperText, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { TranslucentStatusBar, ErrorMessage, PlatformBackButton, Illustration } from '@components';
import { requestPasswordReset } from '@redux/actions/data/account';
import { AccountRequestState, State } from '@ts/types';
import { Alert } from '@utils';

import type { AuthScreenNavigationProp } from '.';
import getStyles from './styles';

type AuthResetPasswordProps = {
  navigation: AuthScreenNavigationProp<'Login'>;
  reqState: AccountRequestState;
};

const AuthResetPassword: React.FC<AuthResetPasswordProps> = ({
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

  const theme = useTheme();
  const styles = getStyles(theme);

  const ResetPasswordSchema = Yup.object().shape({
    username: Yup.string().required("Nom d'utilisateur ou email requis"),
  });

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {reqState.passwordRequest?.loading ? (
            <ProgressBar indeterminate />
          ) : (
            <View style={{ height: 4 }} />
          )}
          {reqState.passwordRequest?.success === false && (
            <ErrorMessage
              error={reqState.passwordRequest?.error}
              strings={{
                what: 'la connexion',
                contentSingular: 'Le compte',
              }}
              type="axios"
            />
          )}
          <ScrollView keyboardShouldPersistTaps="handled">
            <PlatformBackButton onPress={navigation.goBack} />
            <View style={styles.stepIndicatorContainer}>
              <View style={styles.centerIllustrationContainer}>
                <Illustration name="auth-login" height={200} width={200} />
                <Text style={styles.title}>Oubli de mot de passe</Text>
              </View>
            </View>
            <View style={styles.formContainer}>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={ResetPasswordSchema}
                validateOnMount={false}
                onSubmit={async ({ username }) => {
                  requestPasswordReset(username).then(() => {
                    navigation.goBack();
                    Alert.alert(
                      'Email envoyé',
                      'Veuillez vérifier votre boite mail. Un lien vous a été envoyé permettant de changer votre mot de passe. Celui-ci est valide 2 heures.',
                      [
                        {
                          text: 'Fermer',
                        },
                      ],
                      { cancelable: true },
                    );
                  });
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <View>
                    <TextInput
                      ref={usernameInput}
                      label="Nom d'utilisateur ou adresse mail"
                      accessibilityLabel="Nom d'utilisateur ou adresse mail"
                      value={values.username}
                      error={!!errors.username && touched.username} // `!!` transforms it into a boolean
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      onSubmitEditing={() => handleSubmit()}
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

                    <View style={styles.buttonContainer}>
                      <Button
                        mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                        uppercase={Platform.OS !== 'ios'}
                        onPress={handleSubmit}
                        style={{ flex: 1 }}
                      >
                        Envoyer un email
                      </Button>
                    </View>
                  </View>
                )}
              </Formik>
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

export default connect(mapStateToProps)(AuthResetPassword);
