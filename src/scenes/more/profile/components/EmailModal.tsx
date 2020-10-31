import React from 'react';
import { Divider, Button, HelperText, ProgressBar } from 'react-native-paper';
import { View, Platform, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
// import LocalAuthentication from 'rn-local-authentication';

import { ModalProps, State } from '@ts/types';
import { CollapsibleView, ErrorMessage, Modal } from '@components/index';
import { useTheme, request } from '@utils/index';
import getStyles from '@styles/Styles';
import { updateEmail } from '@redux/actions/data/profile';
import { fetchAccount } from '@redux/actions/data/account';

import getArticleStyles from '../styles/Styles';

type EmailModalProps = ModalProps & {
  state: { updateProfile: { loading: boolean; error: any } };
};

const EmailModal: React.FC<EmailModalProps> = ({ visible, setVisible, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const profileStyles = getArticleStyles(theme);
  const { colors } = theme;

  const emailInput = React.useRef(null);

  const [emailValidation, setValidation] = React.useState({
    valid: false,
    error: false,
    message: '',
  });

  async function validateEmailInput(emailText: string) {
    let validation: { valid: boolean; error: any; message?: string } = {
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
          result = await request('auth/check/local/email', 'get', {
            email: emailText,
          });
        } catch (err) {
          validation = {
            valid: false,
            error: true,
            message: 'Erreur lors de la validation de l&apos;adresse mail',
          };
        }
        if (result?.data?.emailExists === false) {
          validation = { valid: true, error: false };
        } else {
          validation = {
            valid: false,
            error: true,
            message: 'Cette adresse email à déjà été utilisée',
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
    const emailValidation = await validateEmailInput(email);
    if (emailValidation.valid) {
      Alert.alert(
        "Changer l'adresse email ?",
        `Vous ne pourrez plus écrire de contenus tant que vous n'aurez pas validé l'email ${email} .`,
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
            onPress: async () => {
              updateEmail(email).then(() => {
                setEmail('');
                setVisible(false);
                fetchAccount();
              });
            },
          },
        ],
        { cancelable: true },
      );
    } else if (emailValidation.valid) {
    } else {
      emailInput.current?.focus();
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      {state.updateProfile.loading && <ProgressBar indeterminate />}
      {state.updateProfile.error && (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'la modification du compte',
            contentSingular: 'Le compte',
          }}
          error={state.updateProfile.error}
          retry={update}
        />
      )}
      <View>
        <View style={profileStyles.inputContainer}>
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
            style={profileStyles.borderlessInput}
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
            uppercase={Platform.OS !== 'ios'}
            onPress={update}
          >
            Confirmer
          </Button>
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
