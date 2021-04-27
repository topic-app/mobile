import { Formik } from 'formik';
import React, { createRef } from 'react';
import {
  Linking,
  Platform,
  View,
  ActivityIndicator,
  TextInput as RNTextInput,
  Image,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Button, Divider, List, RadioButton, Text, useTheme } from 'react-native-paper';
import WebView from 'react-native-webview';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import {
  ErrorMessage,
  FormTextInput,
  Illustration,
  SettingRadio,
  SettingSection,
  SettingToggle,
  SettingTooltip,
} from '@components';
import { Config } from '@constants';
import { sendFeedback } from '@redux/actions/api/feedback';
import { fetchEmail } from '@redux/actions/data/account';
import { LinkingRequestState, State } from '@ts/types';
import { Errors, Alert, trackEvent } from '@utils';

import Modal from './Modal';
import getStyles from './styles/MainFeedbackStylesheet';

type Props = {
  visible: boolean;
  loggedIn: boolean;
  accountId?: string | null;
  accountEmail?: string | null;
  state: LinkingRequestState;
  setVisible: (val: boolean) => void;
};

const FeedbackCard: React.FC<Props> = ({
  visible,
  setVisible,
  loggedIn,
  accountId,
  accountEmail,
  state,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const messageInput = createRef<RNTextInput>();
  const emailInput = createRef<RNTextInput>();

  const [submitted, setSubmitted] = React.useState(false);

  if (!visible && submitted) {
    setSubmitted(false);
  }

  const FeedbackSchema = Yup.object().shape({
    type: Yup.string().required('Vous devez spécifier un type'),
    message: Yup.string().required('Vous devez spécifier un message'),
    email: Yup.string().matches(
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,13})+$/,
      'Email invalide',
    ),
    data: Yup.string().matches(/(yes|no)/),
  });

  React.useEffect(() => {
    fetchEmail();
  }, [null]);

  const types = ['Rapport de bug', 'Demande de fonctionnalité', 'Question', 'Autre'];

  return Platform.OS === 'web' ? null : (
    <Modal visible={visible} setVisible={setVisible}>
      {submitted ? (
        <View>
          <View style={[styles.centerIllustrationContainer, { marginTop: 40 }]}>
            <Image
              style={{ height: 200 }}
              resizeMode="contain"
              source={require('@assets/images/chouettes/party.png')}
            />
            <Text style={styles.title}>Merci pour votre feedback !</Text>
          </View>
          <View style={[styles.container, { marginTop: 80 }]}>
            <Button
              mode="outlined"
              uppercase={Platform.OS !== 'ios'}
              onPress={() => {
                setSubmitted(false);
                setVisible(false);
              }}
              style={{ flex: 1 }}
            >
              Fermer
            </Button>
          </View>
        </View>
      ) : (
        <Formik
          initialValues={{ type: types[0], message: '', email: '', data: 'yes' }}
          validationSchema={FeedbackSchema}
          onSubmit={({ type, message, email, data }) => {
            const brand = DeviceInfo.getBrand();
            const deviceId = DeviceInfo.getDeviceId();
            const product = DeviceInfo.getProductSync();
            const systemVersion = DeviceInfo.getSystemVersion();
            const topicVersion = DeviceInfo.getReadableVersion();
            const apiLevel = Platform.OS === 'android' ? DeviceInfo.getApiLevelSync() : 'unk';
            const userAgent = DeviceInfo.getUserAgentSync();
            sendFeedback({
              type,
              message,
              user: {
                id: data === 'yes' ? accountId : null,
                email: loggedIn ? (data === 'yes' ? accountEmail : null) : email || null,
                loggedIn,
              },
              metadata: {
                device: `${brand}-${product}-${deviceId}`,
                app: `${topicVersion}`,
                os: `${Platform.OS}-${systemVersion}-api${apiLevel}`,
                extra: `UA: ${userAgent}`,
              },
            })
              .then(() => setSubmitted(true))
              .catch((error) => {
                Errors.showPopup({
                  type: 'axios',
                  what: "l'envoi du feedback",
                  error,
                });
              });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <View>
                {types.map((type) => (
                  <SettingRadio
                    title={type}
                    checked={values.type === type}
                    onPress={() => handleChange('type')(type)}
                  />
                ))}
              </View>
              <Divider />
              <View style={[styles.container, { marginBottom: 20 }]}>
                <FormTextInput
                  ref={messageInput}
                  label="Message"
                  value={values.message}
                  touched={touched.message}
                  error={errors.message}
                  onChangeText={handleChange('message')}
                  multiline
                  onBlur={handleBlur('message')}
                  style={styles.textInput}
                  numberOfLines={6}
                />
                {loggedIn ? (
                  <SettingToggle
                    value={values.data === 'yes'}
                    title="Donner mon adresse email aux développeurs"
                    description={
                      values.data === 'yes'
                        ? 'Vous pourrez recevoir une réponse'
                        : 'Vous ne recevrez pas de réponse'
                    }
                    onPress={() => {
                      if (values.type === 'Question' && values.data === 'yes') {
                        Alert.alert(
                          'Voulez vous vraiment cacher votre email?',
                          'Si vous cachez votre email, vous ne pourrez pas recevoir de réponse à votre question',
                          [
                            { text: 'Annuler' },
                            { text: 'Confirmer', onPress: () => handleChange('data')('no') },
                          ],
                        );
                      } else {
                        handleChange('data')(values.data === 'no' ? 'yes' : 'no');
                      }
                    }}
                  />
                ) : (
                  <FormTextInput
                    ref={emailInput}
                    label="Email (facultatif)"
                    value={values.email}
                    touched={touched.email}
                    error={errors.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    style={styles.textInput}
                  />
                )}
              </View>
              <View>
                <SettingTooltip
                  tooltip="Certaines données sur le modèle de votre téléphone et sur votre système d'exploitation sont envoyées pour nous aider à résoudre les problèmes"
                  icon="shield-outline"
                />
              </View>
              <View style={styles.container}>
                <Button
                  mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                  uppercase={Platform.OS !== 'ios'}
                  onPress={() => handleSubmit()}
                  style={{ flex: 1 }}
                  loading={state.feedback?.loading}
                >
                  Envoyer
                </Button>
              </View>
            </View>
          )}
        </Formik>
      )}
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { account, linking } = state;
  return {
    loggedIn: account.loggedIn,
    accountId: account.accountInfo?.accountId,
    accountEmail: account.accountInfo?.email,
    state: linking.state,
  };
};

export default connect(mapStateToProps)(FeedbackCard);
