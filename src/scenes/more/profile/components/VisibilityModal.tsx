import React from 'react';
import { Divider, Button, RadioButton, List, ProgressBar } from 'react-native-paper';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';

import { ModalProps } from '@ts/types';
import { ErrorMessage, Modal } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';
import { updateData } from '@redux/actions/data/profile';
import { fetchAccount } from '@redux/actions/data/account';

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
    }).then(() => {
      setVisible(false);
      fetchAccount();
    });
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
        <List.Item
          title="Compte public"
          description="Les autres utilisateurs peuvent voir votre école, votre nom, votre prénom et les groupes que vous suivez."
          onPress={() => {
            setPublic(true);
          }}
          left={() =>
            Platform.OS !== 'ios' && (
              <RadioButton
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
          description="Les autres utilisateurs peuvent voir les groupes auquels vous appartenez. Vous ne pouvez pas être administrateur d'un groupe."
          onPress={() => {
            setPublic(false);
          }}
          left={() =>
            Platform.OS !== 'ios' && (
              <RadioButton
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
      </View>
      <View>
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

const mapStateToProps = (state) => {
  const { account } = state;
  return {
    isInitialPublic: account.accountInfo?.user?.data?.public,
    state: account.state,
  };
};

export default connect(mapStateToProps)(VisibilityModal);
