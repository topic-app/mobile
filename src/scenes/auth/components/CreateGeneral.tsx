import { Formik } from 'formik';
import React, { createRef } from 'react';
import { View, Platform, TextInput as RNTextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { score } from 'react-native-zxcvbn';
import * as Yup from 'yup';

import { StepperViewPageProps, FormTextInput, StrengthMeter } from '@components/index';
import { updateCreationData, updateState } from '@redux/actions/data/account';
import { useTheme, request } from '@utils/index';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps;

const AuthCreatePageGeneral: React.FC<Props> = ({ next }) => {
  const usernameInput = createRef<RNTextInput>();
  const emailInput = createRef<RNTextInput>();
  const passwordInput = createRef<RNTextInput>();

  const theme = useTheme();
  const authStyles = getAuthStyles(theme);

  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
      .max(25, "Le nom d'utilisateur doit contenir moins de 26 caractères")
      .matches(
        /^[a-zA-Z0-9_.]+$/i,
        "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux sauf « _ » et « . »",
      )
      .required("Nom d'utilisateur requis")
      .test('checkUsernameTaken', "Ce nom d'utilisateur existe déjà", async (username) => {
        if (!username) return true;

        let result;
        try {
          result = await request('auth/check/local/username', 'get', { username });
        } catch (err) {
          updateState({ check: { success: false, error: err, loading: false } });
        }
        return !result?.data?.usernameExists;
      }),
    email: Yup.string()
      .matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,13})+$/, 'Email invalide')
      .required('Email requis')
      .test('checkEmailInUse', 'Cet adresse email est déjà utilisée', async (email) => {
        // Make sure the email is valid before sending a request
        if (!email || email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,13})+$/) === null) {
          return false;
        }
        let result;
        try {
          result = await request('auth/check/local/email', 'get', { email });
        } catch (err) {
          updateState({ check: { success: false, error: err, loading: false } });
        }
        return !result?.data?.emailExists;
      }),
    password: Yup.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .max(128, 'Le mot de passe doit contenir moins de 128 caractères')
      .required('Mot de passe requis')
      .test(
        'checkPasswordStrength',
        "Votre mot de passe n'est pas assez robuste, essayez d'inclure des lettres, chiffres et symboles",
        async (password) => {
          const strength = await score(password);
          setPasswordStrength(strength);
          return strength >= 3;
        },
      ),
  });

  return (
    <View style={authStyles.formContainer}>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          updateCreationData(values);
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
              style={authStyles.textInput}
              textContentType="username"
              autoCompleteType="username"
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
              style={authStyles.textInput}
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
              style={authStyles.textInput}
              textContentType="password"
              autoCapitalize="none"
              autoCompleteType="password"
              autoCorrect={false}
              returnKeyType="go"
              secureTextEntry
            />
            <StrengthMeter level={passwordStrength} />
            <View style={authStyles.buttonContainer}>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => handleSubmit()}
                style={{ flex: 1 }}
              >
                Suivant
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default AuthCreatePageGeneral;
