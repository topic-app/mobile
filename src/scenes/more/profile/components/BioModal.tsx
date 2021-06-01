import React from 'react';
import { View, Platform, TextInput as TextInputRef } from 'react-native';
import { Divider, Button, TextInput, useTheme, HelperText } from 'react-native-paper';
import { connect } from 'react-redux';

import { Modal } from '@components';
import { fetchAccount } from '@redux/actions/data/account';
import { updateData } from '@redux/actions/data/profile';
import { ModalProps, State, Account } from '@ts/types';
import { Errors } from '@utils';

import getStyles from '../styles';

type BioModalProps = ModalProps & {
  account: Account;
  state: { updateProfile: { loading: boolean; error: any } };
};

const BioModal: React.FC<BioModalProps> = ({ visible, setVisible, account, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const bioLength = 300;

  const bioInputRef = React.useRef<TextInputRef>(null);

  const [description, setDescription] = React.useState(
    account.accountInfo?.user?.data?.description,
  );

  const update = () => {
    if ((description?.length || 0) > bioLength) {
      return;
    }
    updateData({ description })
      .then(() => {
        setVisible(false);
        fetchAccount();
      })
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: 'la modification de la biographie',
          error,
          retry: update,
        }),
      );
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={{ marginHorizontal: 5, marginBottom: 10 }}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={bioInputRef}
              autoFocus
              mode="outlined"
              label="Biographie"
              multiline
              numberOfLines={6}
              value={description}
              onChangeText={setDescription}
              onSubmitEditing={() => update()}
            />
          </View>
          <HelperText
            type={(description?.length || 0) > bioLength ? 'error' : 'info'}
            style={{ alignSelf: 'flex-end', marginRight: 10 }}
          >
            {(description?.length || 0) > bioLength ? 'Bio trop longue - ' : ''}
            {description?.length || '?'}/{bioLength}
          </HelperText>
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

export default connect(mapStateToProps)(BioModal);
