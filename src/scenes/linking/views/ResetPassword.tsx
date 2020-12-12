import { RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { Platform, View, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Text, Button, Divider, Checkbox, List } from 'react-native-paper';
import { score } from 'react-native-zxcvbn';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import {
  Illustration,
  ErrorMessage,
  TranslucentStatusBar,
  CustomHeaderBar,
  StrengthMeter,
  FormTextInput,
} from '@components/index';
import { linking } from '@redux/actions/apiActions/linking';
import { accountDelete, passwordReset } from '@redux/actions/data/profile';
import getStyles from '@styles/Styles';
import { State, LinkingRequestState } from '@ts/types';
import { useTheme } from '@utils/index';

import types from '../data/types.json';
import type { LinkingScreenNavigationProp, LinkingStackParams } from '../index';
import getLinkingStyles from '../styles/Styles';

type Props = {
  navigation: LinkingScreenNavigationProp<'Linking'>;
  route: RouteProp<LinkingStackParams, 'Linking'>;
  state: LinkingRequestState;
};

const Linking: React.FC<Props> = ({ navigation, route, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const linkingStyles = getLinkingStyles(theme);
  const { colors } = theme;

  const { id, token } = route.params;

  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const RegisterSchema = Yup.object().shape({
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
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              hideBack: true,
              title: 'Topic',
              subtitle: 'Réinitialisation du mot de passe',
            },
          },
        }}
      />
      <View style={{ flex: 1, flexGrow: 1 }}>
        <ScrollView>
          <Formik
            initialValues={{ username: '', email: '', password: '' }}
            validationSchema={RegisterSchema}
            onSubmit={(values) => {
              passwordReset(id, token, values.password).then(() => {
                navigation.replace('Root', {
                  screen: 'Main',
                  params: {
                    screen: 'Home1',
                    params: { screen: 'Home2', params: { screen: 'Article' } },
                  },
                });
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
              });
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.container}>
                {state.accountDelete.error ? (
                  <View>
                    <ErrorMessage
                      type="axios"
                      strings={{
                        what: "l'ouverture du lien",
                        contentSingular: 'Le lien',
                      }}
                      error={state.accountDelete.error}
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
                  <Text style={linkingStyles.title}>Réinitialisez votre mot de passe</Text>
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
                      style={linkingStyles.textInput}
                      textContentType="password"
                      autoCapitalize="none"
                      autoCompleteType="password"
                      autoCorrect={false}
                      returnKeyType="go"
                      secureTextEntry
                    />
                    <StrengthMeter level={passwordStrength} />
                    <View style={linkingStyles.buttonContainer}>
                      <Button
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
        </ScrollView>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { linking } = state;
  return { state: linking.state };
};

export default connect(mapStateToProps)(Linking);