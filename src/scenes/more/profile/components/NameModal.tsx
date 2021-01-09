import React from 'react';
import { View, Platform, TextInput as TextInputRef } from 'react-native';
import { Divider, Button, TextInput, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import { ErrorMessage, Modal } from '@components/index';
import { fetchAccount } from '@redux/actions/data/account';
import { updateData } from '@redux/actions/data/profile';
import getStyles from '@styles/Styles';
import { ModalProps, State, Account } from '@ts/types';
import { Errors, useTheme } from '@utils/index';

import getprofileStyles from '../styles/Styles';

type NameModalProps = ModalProps & {
  account: Account;
  state: { updateProfile: { loading: boolean; error: any } };
};

const NameModal: React.FC<NameModalProps> = ({ visible, setVisible, account, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const profileStyles = getprofileStyles(theme);
  const { colors } = theme;

  const firstNameInputRef = React.useRef<TextInputRef>(null);
  const lastNameInputRef = React.useRef<TextInputRef>(null);

  const [firstName, setFirstName] = React.useState(account.accountInfo?.user?.data?.firstName);
  const [lastName, setLastName] = React.useState(account.accountInfo?.user?.data?.lastName);

  const update = () => {
    updateData({ firstName, lastName })
      .then(() => {
        setVisible(false);
        fetchAccount();
      })
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: 'la modification du nom',
          error,
          retry: update,
        }),
      );
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={{ marginHorizontal: 5, marginBottom: 10 }}>
          <View style={profileStyles.inputContainer}>
            <TextInput
              ref={firstNameInputRef}
              autoFocus
              mode="outlined"
              label="Prénom"
              value={firstName}
              onChangeText={setFirstName}
              onSubmitEditing={() => lastNameInputRef.current?.focus()}
            />
          </View>
          <View style={profileStyles.inputContainer}>
            <TextInput
              ref={lastNameInputRef}
              mode="outlined"
              label="Nom"
              value={lastName}
              onChangeText={setLastName}
              onSubmitEditing={() => update()}
            />
          </View>
        </View>
        <Divider style={{ marginTop: 10 }} />
        <View style={styles.contentContainer}>
          <Button
            mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
            color={colors.primary}
            uppercase={Platform.OS !== 'ios'}
            onPress={update}
            loading={state.updateProfile.loading}
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
    account,
    state: account.state,
  };
};

export default connect(mapStateToProps)(NameModal);
