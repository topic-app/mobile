import { Formik } from 'formik';
import React, { createRef } from 'react';
import { View, Platform, TextInput as RNTextInput, Text } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import zxcvbn from 'zxcvbn';

import { StepperViewPageProps, FormTextInput, StrengthMeter } from '@components';
import { updateCreationData, updateState } from '@redux/actions/data/account';
import { hashPassword, request, trackEvent } from '@utils';

import getStyles from '../styles';

type Props = StepperViewPageProps;

const AuthCreatePageGeneral: React.FC<Props> = ({ next }) => {
  const usernameInput = createRef<RNTextInput>();
  const emailInput = createRef<RNTextInput>();
  const passwordInput = createRef<RNTextInput>();

  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
      .max(25, "Le nom d'utilisateur doit contenir moins de 26 caractères")
      .matches(
        /^[a-zA-Z0-9_.]+$/i,
        "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux sauf « _ » et « . ».",
      )
      .required("Nom d'utilisateur requis")
      .test('checkUsernameTaken', "Ce nom d'utilisateur existe déjà.", async (username) => {
        if (!username) return true;

        let result;
        try {
          result = await request('auth/check/local/username', 'get', { username }, false, 'auth');
        } catch (err) {
          updateState({ check: { success: false, error: err, loading: false } });
          return false;
        }
        return !result?.data?.usernameExists;
      }),
    email: Yup.string()
      .matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,13})+$/, 'Email invalide')
      .required('Email requis')
      .test('checkEmailInUse', 'Cet adresse email a déjà été utilisée.', async (email) => {
        // Make sure the email is valid before sending a request
        if (!email || email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,13})+$/) === null) {
          return false;
        }
        let result;
        try {
          result = await request('auth/check/local/email', 'get', { email }, false, 'auth');
        } catch (err) {
          updateState({ check: { success: false, error: err, loading: false } });
          return false;
        }
        return !result?.data?.emailExists;
      }),
    password: Yup.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
      .max(128, 'Le mot de passe doit contenir moins de 128 caractères')
      .required('Mot de passe requis')
      .test(
        'checkPasswordStrength',
        "Votre mot de passe n'est pas assez robuste, essayez d'inclure des lettres, chiffres et symboles",
        async (password) => {
          const strength = zxcvbn(password || '').score;
          setPasswordStrength(strength);
          return strength >= 3;
        },
      ),
  });

  return (
    <View style={styles.formContainer}>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={RegisterSchema}
        onSubmit={async ({ email, password, username }) => {
          updateCreationData({ email, username, password: await hashPassword(password) });
          trackEvent('auth:create-page-privacy');
          next();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <FormTextInput
              ref={usernameInput}
              label="Nom d'utilisateur"
              value={values.username}
              touched={touched.username}
              error={errors.username}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              onSubmitEditing={() => emailInput.current?.focus()}
              style={styles.textInput}
              textContentType="username"
              autoCorrect={false}
              autoCapitalize="none"
              autoFocus
            />
            <FormTextInput
              ref={emailInput}
              label="Email"
              value={values.email}
              touched={touched.email}
              error={errors.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              onSubmitEditing={() => passwordInput.current?.focus()}
              style={styles.textInput}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCompleteType="email"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <FormTextInput
              ref={passwordInput}
              label="Mot de passe"
              value={values.password}
              touched={touched.password}
              error={errors.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              onSubmitEditing={() => handleSubmit()}
              style={styles.textInput}
              textContentType="password"
              autoCapitalize="none"
              autoCompleteType="password"
              autoCorrect={false}
              returnKeyType="go"
              secureTextEntry
            />
            <StrengthMeter level={passwordStrength} />
            <View style={styles.buttonContainer}>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => handleSubmit()}
                style={{ flex: 1 }}
              >
                Suivant
              </Button>
            </View>
            <View style={{ marginTop: 50 }}>
              <Card
                elevation={0}
                style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
              >
                <View style={[styles.container, { flexDirection: 'row' }]}>
                  <Icon
                    name="information-outline"
                    style={{ alignSelf: 'center', marginRight: 10 }}
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={{ color: colors.text, flex: 1 }}>
                    Ne créez pas un compte pour représenter votre association ou club. Vous pourrez
                    créer un groupe dans un second temps, qui vous permettra de publier des contenus
                    et d&apos;inviter d&apos;autres personnes.
                  </Text>
                </View>
              </Card>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default AuthCreatePageGeneral;
