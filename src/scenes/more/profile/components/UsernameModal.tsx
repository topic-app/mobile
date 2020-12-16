import React from 'react';
import { View, Platform, TextInput } from 'react-native';
import { Divider, Button, HelperText, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import { CollapsibleView, ErrorMessage, Modal } from '@components/index';
import { fetchAccount } from '@redux/actions/data/account';
import { updateUsername } from '@redux/actions/data/profile';
import getStyles from '@styles/Styles';
import { ModalProps, State } from '@ts/types';
import { useTheme, request } from '@utils/index';

import getArticleStyles from '../styles/Styles';

type UsernameModalProps = ModalProps & {
  state: { updateProfile: { loading: boolean; error: any } };
};

const UsernameModal: React.FC<UsernameModalProps> = ({ visible, setVisible, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const profileStyles = getArticleStyles(theme);
  const { colors } = theme;

  const usernameInput = React.useRef<TextInput>(null);

  const [usernameValidation, setValidation] = React.useState({
    valid: false,
    error: false,
    message: '',
  });

  async function validateUsernameInput(username: string) {
    let validation: { valid: boolean; error: any; message: string } = {
      valid: false,
      error: false,
      message: '',
    };

    if (username !== '') {
      if (username.length < 3) {
        validation = {
          valid: false,
          error: true,
          message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
        };
      } else if (username.match(/^[a-zA-Z0-9_.]+$/i) === null) {
        validation = {
          valid: false,
          error: true,
          message:
            "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux sauf « _ » et « . »",
        };
      } else {
        let result;
        try {
          result = await request(
            'auth/check/local/username',
            'get',
            {
              username,
            },
            false,
            'auth',
          );
        } catch (err) {
          validation = {
            valid: false,
            error: true,
            message: "Erreur lors de la vérification du nom d'utilisateur",
          };
        }
        if (result?.data?.usernameExists === false) {
          validation = { valid: true, error: false, message: '' };
        } else {
          validation = {
            valid: false,
            error: true,
            message: "Ce nom d'utilisateur existe déjà",
          };
        }
      }
    }
    setValidation(validation);
    return validation;
  }

  function preValidateUsernameInput(username: string) {
    if (username.length >= 3 && username.match(/^[a-zA-Z0-9_.]+$/i) !== null) {
      setValidation({ valid: false, error: false, message: '' });
    }
  }

  const [username, setUsername] = React.useState('');

  const update = async () => {
    const usernameValidation = await validateUsernameInput(username);
    if (usernameValidation.valid) {
      updateUsername(username).then(() => {
        setVisible(false);
        fetchAccount();
      });
    } else {
      usernameInput.current?.focus();
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
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
              ref={usernameInput}
              autoFocus
              placeholder="Nouveau nom d'utilisateur"
              placeholderTextColor={colors.disabled}
              style={profileStyles.borderlessInput}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                preValidateUsernameInput(text);
              }}
              onSubmitEditing={update}
            />
            <CollapsibleView collapsed={!usernameValidation.error}>
              <HelperText type="error" visible>
                {usernameValidation.message}
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

export default connect(mapStateToProps)(UsernameModal);
