import React from 'react';
import { View, Platform } from 'react-native';
import { Divider, Button, RadioButton, List, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Modal } from '@components';
import { fetchAccount } from '@redux/actions/data/account';
import { updateData } from '@redux/actions/data/profile';
import getStyles from '@styles/global';
import { ModalProps, State } from '@ts/types';
import { Errors } from '@utils';

type VisibilityModalProps = ModalProps & {
  isInitialPublic: boolean;
  state: { updateProfile: { loading: boolean; error: any } };
};

const VisibilityModal: React.FC<VisibilityModalProps> = ({
  visible,
  setVisible,
  isInitialPublic,
  state,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [isPublic, setPublic] = React.useState(isInitialPublic);

  const update = () => {
    updateData({
      public: isPublic,
      ...(!isPublic ? { firstName: '', lastName: '' } : {}),
    })
      .then(() => {
        setVisible(false);
        fetchAccount();
      })
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: 'la modification de la visibilité',
          error,
          retry: update,
        }),
      );
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <List.Item
          title="Compte public"
          description="Les autres utilisateurs peuvent voir votre école, votre nom, votre prénom et les groupes que vous suivez."
          onPress={() => {
            setPublic(true);
          }}
          left={() =>
            Platform.OS !== 'ios' && (
              <RadioButton
                value=""
                color={colors.primary}
                status={isPublic ? 'checked' : 'unchecked'}
                onPress={() => {
                  setPublic(true);
                }}
              />
            )
          }
          right={() =>
            Platform.OS === 'ios' && (
              <RadioButton
                value=""
                color={colors.primary}
                status={isPublic ? 'checked' : 'unchecked'}
                onPress={() => {
                  setPublic(true);
                }}
              />
            )
          }
        />
        <List.Item
          title="Compte privé"
          description="Les autres utilisateurs peuvent voir les groupes auquels vous appartenez."
          onPress={() => {
            setPublic(false);
          }}
          left={() =>
            Platform.OS !== 'ios' && (
              <RadioButton
                value=""
                color={colors.primary}
                status={!isPublic ? 'checked' : 'unchecked'}
                onPress={() => {
                  setPublic(false);
                }}
              />
            )
          }
          right={() =>
            Platform.OS === 'ios' && (
              <RadioButton
                value=""
                color={colors.primary}
                status={!isPublic ? 'checked' : 'unchecked'}
                onPress={() => {
                  setPublic(false);
                }}
              />
            )
          }
        />
        <Divider />
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
    isInitialPublic: account.accountInfo?.user?.data?.public || false,
    state: account.state,
  };
};

export default connect(mapStateToProps)(VisibilityModal);
