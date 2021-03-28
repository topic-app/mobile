import React from 'react';
import { View, SectionList, ActivityIndicator } from 'react-native';
import { Text, ProgressBar, Divider, FAB, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  Illustration,
  CategoryTitle,
  ErrorMessage,
  GroupsBanner,
  GroupCard,
  CustomHeaderBar,
  TranslucentStatusBar,
} from '@components';
import { updateGroups } from '@redux/actions/api/groups';
import { fetchGroups, fetchWaitingGroups } from '@redux/actions/data/account';
import getStyles from '@styles/global';
import {
  Account,
  GroupsState,
  GroupRequestState,
  AccountRequestState,
  State,
  AnyGroup,
} from '@ts/types';

import type { MyGroupsScreenNavigationProp } from '.';

type MyGroupsListProps = {
  account: Account;
  groups: GroupsState;
  state: GroupRequestState;
  accountState: AccountRequestState;
  navigation: MyGroupsScreenNavigationProp<'List'>;
};

const MyGroupsList: React.FC<MyGroupsListProps> = ({
  navigation,
  account,
  groups,
  state,
  accountState,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const fetch = (refresh = false) => {
    updateGroups(refresh ? 'refresh' : 'initial');
    fetchWaitingGroups();
    fetchGroups();
  };

  React.useEffect(fetch, [null]);

  type MyGroupsData = {
    key: string;
    title: string;
    data: AnyGroup[];
  };

  const data: MyGroupsData[] = [
    // Groups where the user is a member
    {
      key: 'members',
      title: 'Membre',
      data: account.groups || [],
    },
    {
      key: 'following',
      title: 'Suivis',
      data:
        account.accountInfo?.user.data.following.groups.filter(
          (g) => !account.groups?.some((h) => h._id === g._id),
        ) || [],
    },
    {
      key: 'location',
      title: 'Recommandés',
      data:
        groups.data?.filter(
          (g) =>
            !account.groups?.some((h) => h._id === g._id) &&
            !account.accountInfo?.user.data.following.groups.some((h) => h._id === g._id),
        ) || [],
    },
  ];

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Mes groupes',
              actions: [
                {
                  icon: 'magnify',
                  onPress: () =>
                    navigation.navigate('Main', {
                      screen: 'Search',
                      params: {
                        screen: 'Search',
                        params: { initialCategory: 'groups' },
                      },
                    }),
                },
              ],
            },
          },
        }}
      />
      {(state.list.loading.initial ||
        accountState.fetchGroups?.loading ||
        accountState.fetchWaitingGroups?.loading) && <ProgressBar indeterminate />}
      {state.list.error ||
      accountState.fetchGroups?.error ||
      accountState.fetchWaitingGroups?.error ? (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'la récupération des groupes',
            contentPlural: 'des groupes',
            contentSingular: 'La liste de groupes',
          }}
          error={[
            state.list.error,
            accountState.fetchGroups.error,
            accountState.fetchWaitingGroups.error,
          ]}
          retry={fetch}
        />
      ) : null}
      <View style={styles.centeredPage}>
        <SectionList
          sections={data}
          refreshing={state.list.loading.refresh}
          stickySectionHeadersEnabled={false}
          onRefresh={() => fetch(true)}
          ListFooterComponent={
            <View style={[styles.container, { height: 50 }]}>
              {state.list.loading.next && <ActivityIndicator size="large" color={colors.primary} />}
            </View>
          }
          ListHeaderComponent={() => (
            <View>
              <View style={styles.centerIllustrationContainer}>
                <Illustration name="group" height={200} width={200} />
                <View style={[styles.contentContainer, { alignItems: 'center' }]}>
                  <Text>
                    Rejoignez des groupes pour représenter vos clubs, associations et organisations
                    et pour écrire du contenu.
                  </Text>
                </View>
              </View>
              <GroupsBanner />
            </View>
          )}
          renderSectionHeader={({ section }) =>
            section.data.length !== 0 ? (
              <View style={{ marginTop: 10 }}>
                <Divider />
                <CategoryTitle style={{ paddingTop: 13, paddingLeft: 15 }}>
                  {section.title}
                </CategoryTitle>
              </View>
            ) : (
              <View />
            )
          }
          renderItem={({ item }) => (
            <View style={{ margin: 5 }}>
              <GroupCard
                group={item}
                following={account.accountInfo?.user.data.following.groups.some(
                  (g) => g._id === item._id,
                )}
                member={account.groups?.some((g) => g._id === item._id)}
                navigate={() =>
                  navigation.navigate('Main', {
                    screen: 'Display',
                    params: {
                      screen: 'Group',
                      params: {
                        screen: 'Display',
                        params: { id: item._id, title: item.name },
                      },
                    },
                  })
                }
              />
            </View>
          )}
        />
      </View>
      {account.accountInfo?.user?.verification?.verified && (
        <FAB
          icon="plus"
          onPress={() =>
            navigation.navigate('Main', {
              screen: 'Add',
              params: {
                screen: 'Group',
                params: {
                  screen: 'Add',
                },
              },
            })
          }
          style={styles.bottomRightFab}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, groups } = state;
  return {
    account,
    groups,
    state: groups.state,
    accountState: account.state,
  };
};

export default connect(mapStateToProps)(MyGroupsList);
