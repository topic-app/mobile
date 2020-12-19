import React from 'react';
import { View } from 'react-native';
import { Avatar, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import { fetchAccount } from '@redux/actions/data/account';
import { resendVerification } from '@redux/actions/data/profile';
import { State, Account, AccountRequestState } from '@ts/types';
import { Alert, useTheme } from '@utils/index';

import Banner from './Banner';
import ErrorMessage from './ErrorMessage';

type Props = {
  account: Account;
  state: AccountRequestState;
};

const VerificationBanner: React.FC<Props> = ({ account, state }) => {
  const theme = useTheme();
  const { colors } = theme;

  if (!account.loggedIn || account.accountInfo.user.verification?.verified) {
    return null;
  }

  return (
    <View>
      {state.resend?.error && (
        <ErrorMessage
          type="axios"
          strings={{
            what: "la demande d'envoi d'email",
            contentSingular: "L'email",
          }}
          error={state.resend?.error}
          retry={() => resendVerification()}
        />
      )}
      {state.resend?.loading && <ProgressBar indeterminate />}
      <Banner
        visible={!account.accountInfo.user.verification?.verified || false}
        actions={[
          {
            label: 'Rafraichir',
            onPress: () => fetchAccount(),
          },
          {
            label: 'Renvoyer',
            onPress: () =>
              resendVerification().then(() =>
                Alert.alert(
                  'Email de vérification renvoyé',
                  'Vérifiez votre boite mail',
                  [{ text: 'Fermer' }],
                  { cancelable: true },
                ),
              ),
          },
        ]}
        icon={({ size }) => (
          <Avatar.Icon
            style={{ backgroundColor: colors.primary }}
            size={size}
            icon="shield-account"
          />
        )}
      >
        Votre compte est en attente de vérification. Veuillez vérifier votre boite mail.
      </Banner>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account, state: account.state };
};

export default connect(mapStateToProps)(VerificationBanner);
