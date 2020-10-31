import React from 'react';
import { Alert, View } from 'react-native';
import { Banner, Text, Subheading, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import { config } from '@root/app.json';
import { State, Account, AccountRequestState, GroupRequestState } from '@ts/types';
import { handleUrl } from '@utils/index';
import { groupMemberAccept, groupMemberReject } from '@redux/actions/apiActions/groups';
import { fetchWaitingGroups, fetchGroups } from '@redux/actions/data/account';

import Avatar from './Avatar';
import ErrorMessage from './ErrorMessage';

type Props = {
  account: Account;
  state: GroupRequestState;
  accountState: AccountRequestState;
};

const GroupsBanner: React.FC<Props> = ({ account, state, accountState }) => {
  if (!account.loggedIn || account.waitingGroups?.length > 0) return null;

  const refresh = () => {
    fetchWaitingGroups();
    fetchGroups();
  };

  return (
    <View>
      {(state.member_accept?.loading ||
        state.member_reject?.loading ||
        accountState.fetchWaitingGroups?.loading) && <ProgressBar indeterminate />}
      {state.member_accept?.error && (
        <ErrorMessage
          type="axios"
          strings={{
            what: "l'acceptation du groupe",
            contentSingular: "L'acceptation",
          }}
          error={state.member_accept?.error}
          retry={() => groupMemberAccept(account.waitingGroups[0]?._id).then(refresh)}
        />
      )}
      {state.member_reject?.error && (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'le refus du groupe',
            contentSingular: 'Le refus',
          }}
          error={state.member_reject?.error}
          retry={() => groupMemberReject(account.waitingGroups[0]?._id).then(refresh)}
        />
      )}
      <Banner
        visible={account.waitingGroups?.length > 0}
        actions={[
          {
            label: 'Refuser',
            onPress: () =>
              Alert.alert(
                'Refuser de rejoindre le groupe ?',
                'Vous ne pourrez plus le rejoindre sans une autre invitation.',
                [
                  { text: 'Annuler' },
                  {
                    text: 'Refuser',
                    onPress: () => groupMemberReject(account.waitingGroups[0]?._id).then(refresh),
                  },
                ],
                { cancelable: true },
              ),
          },
          {
            label: 'Accepter',
            onPress: () => {
              if (
                account.waitingGroups[0]?.roles?.find(
                  (r) => r._id === account.waitingGroups[0]?.waitingMembership?.role,
                )?.legalAdmin
              ) {
                Alert.alert(
                  'Rejoindre le groupe ?',
                  "Un rôle légalement responsable vous a été attribué.\n\nVous êtes en partie responsable de tous les contenus que vous acceptez. En cliquant sur Accepter, vous confirmez avoir lu et accepté la Charte des Administrateurs, qui détaille les modalités d'acceptation ou de refus des contenus.",
                  [
                    {
                      text: 'Voir la charte des Administrateurs',
                      onPress: () => handleUrl(config.links.administrator),
                    },
                    {
                      text: 'Annuler',
                    },
                    {
                      text: 'Rejoindre',
                      onPress: () => groupMemberAccept(account.waitingGroups[0]?._id).then(refresh),
                    },
                  ],
                  { cancelable: true },
                );
              } else {
                groupMemberAccept(account.waitingGroups[0]?._id).then(refresh);
              }
            },
          },
        ]}
        icon={({ size }) => <Avatar size={size} avatar={account.waitingGroups[0]?.avatar} />}
      >
        <Subheading>
          Rejoindre le groupe {account.waitingGroups[0]?.name} ? {'\n\n'}
        </Subheading>
        <Text>
          Vous avez été invité à rejoindre le groupe {account.waitingGroups[0]?.name} en tant que{' '}
          {
            account.waitingGroups[0]?.roles?.find(
              (r) => r._id === account.waitingGroups[0]?.waitingMembership?.role,
            )?.name
          }
          .
        </Text>
      </Banner>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, groups } = state;
  return { account, state: groups.state, accountState: account.state };
};

export default connect(mapStateToProps)(GroupsBanner);
