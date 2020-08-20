import React from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import {
  Text,
  useTheme,
  Title,
  Subheading,
  Divider,
  Button,
  List,
  ProgressBar,
} from 'react-native-paper';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Account,
  Address,
  State,
  User,
  UsersState,
  Group,
  StandardRequestState,
  RequestState,
  RequestStateComplex,
} from '@ts/types';
import { Avatar, ErrorMessage, InlineCard } from '@components/index';
import getStyles from '@styles/Styles';
import { fetchUser } from '@redux/actions/api/users';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomTabView } from '@components/index';

import getUserStyles from '../styles/Styles';
import { fetchAccount } from '@redux/actions/data/account';
import locationReducer from '@redux/reducers/data/location';
import departmentReducer from '@redux/reducers/api/departments';
import { color } from 'react-native-reanimated';
import { userFollow, userUnfollow } from '@redux/actions/apiActions/users';
import { searchGroups } from '@redux/actions/api/groups';

function getAddressString(address: Address['address']) {
  const { number, street, city, code } = address || {};
  if (number && street && city && code) {
    return `${number} ${street}, ${code} ${city}`;
  }
  if (city) return city;
  return null;
}

function genName({ data, info }) {
  if (data.firstName && data.lastName) {
    return `${data.firstName} ${data.lastName}`;
  }
  return data.firstName || data.lastName || null;
}

function UserDisplay({
  account,
  users,
  navigation,
  route,
  state,
  groups,
  groupsState,
}: {
  account: Account;
  navigation: any;
  route: { params: { id: string } };
  state: { info: RequestState };
  users: UsersState;
  groups: Group[];
  groupsState: { search: RequestStateComplex };
}): React.ReactNode {
  const { id } = route.params || {};

  let user =
    users.item?._id === id
      ? users.item
      : users.data.find((u) => u._id === id) || users.search.find((u) => u._id === id) || null;

  const following = account.accountInfo?.user?.data?.following?.users?.some((g) => g._id === id);

  const toggleFollow = () => {
    if (following) {
      userUnfollow(id).then(fetchAccount);
    } else {
      userFollow(id).then(fetchAccount);
    }
  };

  React.useEffect(() => {
    fetchUser(id);
    searchGroups('initial', '', { members: [id] }, false);
  }, [null]);

  const theme = useTheme();
  const styles = getStyles(theme);
  const userStyles = getUserStyles(theme);
  const { colors } = theme;

  if (!user) {
    return (
      <View style={styles.page}>
        {state.info.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la mise à jour du profil',
              contentPlural: 'des informations de profil',
              contentSingular: 'Le profil',
            }}
            error={state.info.error}
            retry={() => fetchUser(id)}
          />
        )}
        {!state.info.error && (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.page}>
      {state.info.error && (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'la mise à jour du profil',
            contentPlural: 'des informations de profil',
            contentSingular: 'Le profil',
          }}
          error={state.info.error}
          retry={() => fetchUser(id)}
        />
      )}
      <ScrollView>
        <View style={[styles.contentContainer, { marginTop: 20 }]}>
          <View style={[styles.centerIllustrationContainer, { marginBottom: 10 }]}>
            <Avatar size={120} avatar={user.info.avatar} />
          </View>
          <View style={[styles.centerIllustrationContainer, { flexDirection: 'row' }]}>
            {user.data.public ? (
              <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Title>{genName(user) || `@${user.info.username}`}</Title>
                  <View style={{ marginLeft: 5 }}>
                    {user.info.official && (
                      <Icon name="check-decagram" color={colors.primary} size={20} />
                    )}
                  </View>
                </View>
                {genName(user) && (
                  <Subheading style={{ marginTop: -10, color: colors.disabled }}>
                    @{user.info.username}
                  </Subheading>
                )}
              </View>
            ) : (
              <Title>@{user.info.username}</Title>
            )}
          </View>
        </View>
        {state.info.loading && (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        {state.info.success && (
          <View>
            <Divider style={{ marginVertical: 10 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 40 }}>{user.data.cache.followers || ''}</Text>
                <Text>Abonnés </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 40 }}>
                  {user.data.public ? (
                    user.data.following.groups.length +
                    user.data.following.users.length +
                    user.data.following.events.length
                  ) : (
                    <Icon name="lock-outline" size={52} color={colors.disabled} />
                  )}
                </Text>
                <Text>Abonnements </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 40 }}>{groups.length}</Text>
                <Text>Groupes</Text>
              </View>
            </View>
            <Divider style={{ marginVertical: 10 }} />
            {!user.data.public && (
              <View>
                <Divider style={{ height: 2, backgroundColor: colors.primary }} />
                <View
                  style={
                    (styles.container,
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      padding: 10,
                    })
                  }
                >
                  <Icon name="lock" size={20} style={{ marginRight: 10 }} color={colors.primary} />
                  <Text style={{ fontSize: 20, color: colors.primary }}>Compte privé</Text>
                </View>
                <Divider style={{ height: 2, backgroundColor: colors.primary }} />
                <View style={{ height: 10 }} />
              </View>
            )}
            {account.loggedIn &&
              (account.accountInfo.accountId !== user._id ? (
                <View style={styles.container}>
                  <Button
                    loading={state.follow?.loading}
                    mode={following ? 'outlined' : 'contained'}
                    style={{
                      backgroundColor: following ? colors.surface : colors.primary,
                      borderRadius: 20,
                    }}
                    onPress={toggleFollow}
                  >
                    {state.follow?.loading ? '' : following ? 'Abonné' : "S'abonner"}
                  </Button>
                </View>
              ) : (
                <View style={styles.container}>
                  <Button
                    mode="contained"
                    style={{ borderRadius: 20 }}
                    onPress={() =>
                      navigation.navigate('Main', {
                        screen: 'More',
                        params: { screen: 'Profile', params: { screen: 'Profile' } },
                      })
                    }
                  >
                    Modifier mon profil
                  </Button>
                </View>
              ))}
            <View style={{ height: 10 }} />
            {user.data.public && user.data.description && (
              <View>
                <List.Subheader>Description</List.Subheader>
                <Divider />
                <View style={{ alignItems: 'stretch', marginVertical: 20, marginHorizontal: 10 }}>
                  <Text>{user.data.description}</Text>
                </View>
                <View style={{ height: 20 }} />
              </View>
            )}
            {!(groups.length === 0) && (
              <View>
                <List.Subheader>Groupes</List.Subheader>
                <Divider />
                {groupsState.search.error && (
                  <ErrorMessage
                    type="axios"
                    strings={{
                      what: 'le chargement des groups',
                      contentPlural: 'les groupes',
                    }}
                    error={groupsState.search.error}
                    retry={() => fetchUser(id)}
                  />
                )}
                {groupsState.search.loading.initial && (
                  <View style={styles.container}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                )}
                {groupsState.search.success &&
                  groups?.map((group) => (
                    <InlineCard
                      key={group._id}
                      avatar={group.avatar}
                      title={group.name}
                      subtitle={`Groupe ${group.type}`}
                      onPress={() =>
                        navigation.push('Main', {
                          screen: 'Display',
                          params: {
                            screen: 'Group',
                            params: {
                              screen: 'Display',
                              params: { id: group._id, title: group.shortName || group.name },
                            },
                          },
                        })
                      }
                    />
                  ))}
                <View style={{ height: 20 }} />
              </View>
            )}
            {user.data.public && (
              <View>
                <List.Subheader>Localisation</List.Subheader>
                <Divider />
                <View style={{ marginVertical: 10 }}>
                  {user.data.location.global && (
                    <InlineCard
                      icon="map-marker"
                      title="France Entière"
                      onPress={() => console.log('global pressed')}
                    />
                  )}
                  {user.data.location.schools?.map((school) => (
                    <InlineCard
                      key={school._id}
                      icon="school"
                      title={school.displayName}
                      subtitle={`${
                        getAddressString(school.address?.address) || school.address?.shortName
                      }${
                        school.address?.departments[0]
                          ? `, ${
                              school.address?.departments[0].displayName ||
                              school.address?.departments[0].name
                            }`
                          : ' '
                      }`}
                      onPress={() => console.log(`school ${school._id} pressed!`)}
                    />
                  ))}
                  {user.data.location.departments?.map((dep) => (
                    <InlineCard
                      key={dep._id}
                      icon="map-marker-radius"
                      title={dep.name}
                      subtitle={`${dep.type === 'departement' ? 'Département' : 'Région'} ${
                        dep.code
                      }`}
                      onPress={() => console.log(`department ${dep._id} pressed!`)}
                    />
                  ))}
                </View>
                <View style={{ height: 20 }} />
              </View>
            )}
            {user.data.public && (
              <View>
                <List.Subheader>Abonnements</List.Subheader>
                <Divider />
                <CustomTabView
                  scrollEnabled={false}
                  pages={[
                    {
                      key: 'groups',
                      title: 'Groupes',
                      component: (
                        <View>
                          {!user.data?.following.groups?.length && (
                            <View style={[styles.centerIllustrationContainer, styles.container]}>
                              <Text>Aucun abonnement à un groupe</Text>
                            </View>
                          )}
                          {user.data?.following.groups?.map((group) => (
                            <InlineCard
                              key={group._id}
                              avatar={group.avatar}
                              title={group.displayName}
                              subtitle={`Groupe ${group.type}`}
                              onPress={() =>
                                navigation.push('Main', {
                                  screen: 'Display',
                                  params: {
                                    screen: 'Group',
                                    params: {
                                      screen: 'Display',
                                      params: { id: group._id, title: group.displayName },
                                    },
                                  },
                                })
                              }
                            />
                          ))}
                        </View>
                      ),
                    },
                    {
                      key: 'users',
                      title: 'Utilisateurs',
                      component: (
                        <View>
                          {!user.data?.following.users?.length && (
                            <View style={[styles.centerIllustrationContainer, styles.container]}>
                              <Text>Aucun abonnement à un utilisateur</Text>
                            </View>
                          )}
                          {user.data.following.users?.map((user) => (
                            <InlineCard
                              key={user._id}
                              avatar={user.info?.avatar}
                              title={user.displayName}
                              onPress={() =>
                                navigation.push('Main', {
                                  screen: 'Display',
                                  params: {
                                    screen: 'User',
                                    params: {
                                      screen: 'Display',
                                      params: { id: user._id, title: user.displayName },
                                    },
                                  },
                                })
                              }
                            />
                          ))}
                        </View>
                      ),
                    },
                  ]}
                />
                <View style={{ height: 20 }} />
              </View>
            )}
            <List.Subheader>Derniers contenus</List.Subheader>
            <Divider />
            <CustomTabView
              scrollEnabled={false}
              pages={[
                {
                  key: 'articles',
                  title: 'Articles',
                  component: (
                    <View style={styles.container}>
                      <Text>Articles</Text>
                    </View>
                  ),
                },
                {
                  key: 'events',
                  title: 'Evènements',
                  component: (
                    <View style={styles.container}>
                      <Text>Evènements</Text>
                    </View>
                  ),
                },
                {
                  key: 'petitions',
                  title: 'Pétitions',
                  component: (
                    <View style={styles.container}>
                      <Text>Pétitions</Text>
                    </View>
                  ),
                },
              ]}
            />
            <View style={{ height: 20 }} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state: State) => {
  const { users, account, groups } = state;
  return {
    account,
    users,
    state: users.state,
    groups: groups.search,
    groupsState: groups.state,
  };
};

export default connect(mapStateToProps)(UserDisplay);
