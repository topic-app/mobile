import { RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { Platform, View } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import zxcvbn from 'zxcvbn';

import {
  Illustration,
  ErrorMessage,
  StrengthMeter,
  FormTextInput,
  PageContainer,
} from '@components';
import { fetchAccount } from '@redux/actions/data/account';
import { passwordReset } from '@redux/actions/data/profile';
import { State, LinkingRequestState } from '@ts/types';
import { Errors, Alert, hashPassword } from '@utils';

import type { LinkingScreenNavigationProp, LinkingStackParams } from '.';
import getStyles from './styles';

type Props = {
  navigation: LinkingScreenNavigationProp<'ResetPassword'>;
  route: RouteProp<LinkingStackParams, 'ResetPassword'>;
  state: LinkingRequestState;
};

const Linking: React.FC<Props> = ({ navigation, route, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { id, token } = route.params;

  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
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

  const submit = async (values: { password: string }): Promise<void> => {
    try {
      await passwordReset(id, token, await hashPassword(values.password));
    } catch (error) {
      return Errors.showPopup({
        type: 'axios',
        what: 'la réinitialisation du mot de passe',
        error,
        retry: () => submit(values),
      });
    }
    fetchAccount();
    Alert.alert(
      'Mot de passe changé',
      'Utilisez votre nouveau mot de passe pour vous connecter.',
      [
        {
          text: 'Fermer',
        },
      ],
      { cancelable: true },
    );
    navigation.replace('Root', {
      screen: 'Main',
      params: {
        screen: 'Home1',
        params: { screen: 'Home2', params: { screen: 'Article' } },
      },
    });
  };

  return (
    <PageContainer
      headerOptions={{
        hideBack: true,
        title: 'Topic',
        subtitle: 'Réinitialisation du mot de passe',
      }}
      scroll
    >
      <Formik
        initialValues={{ password: '' }}
        validationSchema={ResetPasswordSchema}
        onSubmit={submit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>
            {state.resetPassword.error ? (
              <View>
                <ErrorMessage
                  type="axios"
                  strings={{
                    what: 'la réinitialisation du mot de passe',
                    contentSingular: 'La réinitialisation du mot de passe',
                  }}
                  error={state.resetPassword.error}
                  retry={() => handleSubmit()}
                />
              </View>
            ) : null}
            <View
              style={[
                styles.centerIllustrationContainer,
                styles.contentContainer,
                { marginTop: 40 },
              ]}
            >
              <Illustration name="auth-login" height={200} width={200} />
              <Text style={styles.title}>Réinitialisez votre mot de passe</Text>
            </View>
            <View>
              <View>
                <FormTextInput
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
                    loading={state.resetPassword.loading}
                    disabled={state.resetPassword.loading}
                    mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                    uppercase={Platform.OS !== 'ios'}
                    onPress={() => handleSubmit()}
                    style={{ flex: 1 }}
                  >
                    Changer
                  </Button>
                </View>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { linking } = state;
  return { state: linking.state };
};

export default connect(mapStateToProps)(Linking);
