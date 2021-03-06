import React from 'react';
import { View, Platform, TextInput } from 'react-native';
import { Divider, Button, HelperText, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { CollapsibleView, Modal } from '@components';
import { fetchEmail } from '@redux/actions/data/account';
import { updateEmail } from '@redux/actions/data/profile';
import { ModalProps, State } from '@ts/types';
import { request, Alert, Errors } from '@utils';

import getStyles from '../styles';

// import LocalAuthentication from 'rn-local-authentication';

type EmailModalProps = ModalProps & {
  state: { updateProfile: { loading: boolean; error: any } };
};

const EmailModal: React.FC<EmailModalProps> = ({ visible, setVisible, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const emailInput = React.useRef<TextInput>(null);

  const [emailValidation, setValidation] = React.useState({
    valid: false,
    error: false,
    message: '',
  });

  async function validateEmailInput(emailText: string) {
    let validation: { valid: boolean; error: any; message: string } = {
      valid: false,
      error: false,
      message: '',
    };

    if (emailText !== '') {
      if (emailText.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,13})+$/) === null) {
        validation = {
          valid: false,
          error: true,
          message: 'Adresse mail incorrecte',
        };
      } else {
        let result;
        try {
          result = await request(
            'auth/check/local/email',
            'get',
            {
              email: emailText,
            },
            false,
            'auth',
          );
        } catch (err) {
          validation = {
            valid: false,
            error: true,
            message: "Erreur lors de la validation de l'adresse mail",
          };
        }
        if (result?.data?.emailExists === false) {
          validation = { valid: true, error: false, message: '' };
        } else {
          validation = {
            valid: false,
            error: true,
            message: 'Cette adresse email ?? d??j?? ??t?? utilis??e',
          };
        }
      }
    }

    setValidation(validation);
    return validation;
  }

  function preValidateEmailInput(email: string) {
    if (email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[a-zA-Z]{2,13})+$/) !== null) {
      // TODO: Change to emailExists once server is updated
      setValidation({ valid: false, error: false, message: '' });
    }
  }

  const [email, setEmail] = React.useState('');

  const update = async () => {
    const emailValidationUpdate = await validateEmailInput(email);
    if (emailValidationUpdate.valid) {
      Alert.alert(
        "Changer l'adresse email ?",
        'Vous recevrez un email de confirmations dans votre nouvelle boite mail.',
        [
          {
            text: 'Annuler',
            onPress: () => {
              setEmail('');
              setVisible(false);
            },
          },
          {
            text: 'Changer',
            onPress: () => {
              updateEmail(email)
                .then(() => {
                  setEmail('');
                  setVisible(false);
                  fetchEmail();
                })
                .catch((error) =>
                  Errors.showPopup({
                    type: 'axios',
                    what: "la modification de l'adresse mail",
                    error,
                    retry: update,
                  }),
                );
            },
          },
        ],
        { cancelable: true },
      );
    } else if (emailValidationUpdate.valid) {
    } else {
      emailInput.current?.focus();
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              ref={emailInput}
              autoFocus
              placeholder="Nouvelle adresse mail"
              disableFullscreenUI
              keyboardType="email-address"
              autoCompleteType="email"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              placeholderTextColor={colors.disabled}
              style={styles.borderlessInput}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                preValidateEmailInput(text);
              }}
              onSubmitEditing={() => update()}
            />
            <CollapsibleView collapsed={!emailValidation.error}>
              <HelperText type="error" visible>
                {emailValidation.message}
              </HelperText>
            </CollapsibleView>
          </View>
          <Divider />
          <View style={styles.contentContainer}>
            <Button
              mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
              color={colors.primary}
              loading={state.updateProfile.loading}
              uppercase={Platform.OS !== 'ios'}
              onPress={update}
            >
              Confirmer
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return {
    state: account.state,
  };
};

export default connect(mapStateToProps)(EmailModal);
