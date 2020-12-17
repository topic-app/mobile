import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, ScrollView, ActivityIndicator, StatusBar, Platform, Share } from 'react-native';
import { Text, Title, Subheading, Divider, Button, List, Appbar, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import {
  Avatar,
  ErrorMessage,
  InlineCard,
  TranslucentStatusBar,
  PlatformBackButton,
  ReportModal,
  CustomTabView,
  SafeAreaView,
} from '@components/index';
import { searchArticles } from '@redux/actions/api/articles';
import { searchEvents } from '@redux/actions/api/events';
import { searchGroups } from '@redux/actions/api/groups';
import { fetchUser } from '@redux/actions/api/users';
import { userFollow, userUnfollow, userReport } from '@redux/actions/apiActions/users';
import { fetchAccount } from '@redux/actions/data/account';
import getStyles from '@styles/Styles';
import {
  Account,
  Address,
  State,
  UsersState,
  RequestState,
  UserPreload,
  User,
  ArticlePreload,
  GroupRequestState,
  EventPreload,
  ArticleRequestState,
  EventRequestState,
  GroupPreload,
  UserRequestState,
  Group,
} from '@ts/types';
import { useTheme, logger, Format } from '@utils/index';

import ContentTabView from '../../components/ContentTabView';
import type { UserDisplayScreenNavigationProp, UserDisplayStackParams } from '../index';

function getAddressString(address: Address['address']) {
  const { number, street, city, code } = address || {};
  if (number && street && city && code) {
    return `${number} ${street}, ${code} ${city}`;
  }
  if (city) return city;
  return null;
}

function genName(user: User | UserPreload) {
  if (user.preload) {
    return user.displayName || null;
  }
  return Format.fullUserName(user);
}

type UserDisplayProps = {
  route: RouteProp<UserDisplayStackParams, 'Display'>;
  navigation: UserDisplayScreenNavigationProp<'Display'>;
  account: Account;
  state: UserRequestState;
  users: UsersState;
  groups: (GroupPreload | Group)[];
  groupsState: GroupRequestState;
  articles: ArticlePreload[];
  events: EventPreload[];
  articlesState: ArticleRequestState;
  eventsState: EventRequestState;
};

const UserDisplay: React.FC<UserDisplayProps> = ({
  account,
  users,
  navigation,
  route,
  state,
  groups,
  groupsState,
  articles,
  events,
  articlesState,
  eventsState,
}) => {
  const { id } = route.params || {};

  const user: User | UserPreload | null =
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
    searchGroups('initial', '', { members: [id], number: 0 }, false);
    searchArticles('initial', '', { authors: [id] }, false);
    searchEvents('initial', '', { authors: [id] }, false);
  }, [null]);

  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [isUserReportModalVisible, setUserReportModalVisible] = React.useState(false);

  if (!user) {
    return (
      <View style={styles.page}>
        <SafeAreaView>
          <PlatformBackButton onPress={navigation.goBack} />

          {state.info.error && (
            <ErrorMessage
              type="axios"
              strings={{
                what: "la récupération de l'utilisateur",
                contentPlural: "des informations de l'utilisateur",
                contentSingular: "L'utilisateur",
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
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <SafeAreaView>
        <TranslucentStatusBar />
        {state.info.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: "la récupération de l'utilisateur",
              contentPlural: "des informations de l'utilisateur",
              contentSingular: "L'utilisateur",
            }}
            error={state.info.error}
            retry={() => fetchUser(id)}
          />
        )}
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <PlatformBackButton onPress={navigation.goBack} />
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Appbar.Action
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(true)}
                  color={colors.drawerContent}
                />
              }
              statusBarHeight={StatusBar.currentHeight}
            >
              <Menu.Item
                key="share"
                title="Partager"
                onPress={() => {
                  setMenuVisible(false);
                  if (Platform.OS === 'ios') {
                    Share.share({
                      message: `Utilisateur @${user?.info.username}`,
                      url: `https://go.topicapp.fr/utilisateurs/${user?._id}`,
                    });
                  } else {
                    Share.share({
                      message: `https://go.topicapp.fr/utilisateurs/${user?._id}`,
                      title: `Utilisateur @${user?.info.username}`,
                    });
                  }
                }}
              />
              <Menu.Item
                key="report"
                title="Signaler"
                onPress={() => {
                  setMenuVisible(false);
                  setUserReportModalVisible(true);
                }}
              />
            </Menu>
          </View>

          <View style={[styles.contentContainer, { marginTop: 20 }]}>
            <View style={[styles.centerIllustrationContainer, { marginBottom: 10 }]}>
              <Avatar size={120} avatar={user.info.avatar} />
            </View>
            <View style={[styles.centerIllustrationContainer, { flexDirection: 'row' }]}>
              {user.data?.public ? (
                <View style={{ alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Title>{genName(user)}</Title>
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
          {state.info.success && !user.preload && (
            <View>
              <Divider style={{ marginVertical: 10 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 40 }}>{user.data?.cache?.followers || ''}</Text>
                  <Text>Abonnés </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 40 }}>
                    {user.data?.public ? (
                      user.data.following.groups.length + user.data.following.users.length
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
                    <Icon
                      name="lock"
                      size={20}
                      style={{ marginRight: 10 }}
                      color={colors.primary}
                    />
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
              {user.data?.public && !!user.data?.description && (
                <View>
                  <List.Subheader>Description</List.Subheader>
                  <Divider />
                  <View style={{ alignItems: 'stretch', marginVertical: 20, marginHorizontal: 10 }}>
                    <Text>{user.data.description}</Text>
                  </View>
                  <View style={{ height: 20 }} />
                </View>
              )}
              {groups.length !== 0 && (
                <View>
                  <List.Subheader>Groupes</List.Subheader>
                  <Divider />
                  {groupsState.search?.error && (
                    <ErrorMessage
                      type="axios"
                      strings={{
                        what: 'le chargement des groupes',
                        contentPlural: 'les groupes',
                      }}
                      error={groupsState.search?.error}
                      retry={() => searchGroups('initial', '', { members: [id], number: 0 }, false)}
                    />
                  )}
                  {groupsState.search?.loading.initial && (
                    <View style={styles.container}>
                      <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                  )}
                  {groupsState.search?.success &&
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
                                params: {
                                  id: group._id,
                                  title: group.displayName || group.shortName || group.name,
                                },
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
                        onPress={() => logger.warn('global pressed')}
                      />
                    )}
                    {user.data.location.schools?.map((school) => (
                      <InlineCard
                        key={school._id}
                        icon="school"
                        title={school.name}
                        subtitle={`${
                          school.address?.address
                            ? getAddressString(school.address?.address)
                            : school.address?.shortName
                        }${
                          school.address?.departments[0]
                            ? `, ${
                                school.address?.departments[0].displayName ||
                                school.address?.departments[0].name
                              }`
                            : ' '
                        }`}
                        onPress={() => logger.warn(`school ${school._id} pressed!`)}
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
                        onPress={() => logger.warn(`department ${dep._id} pressed!`)}
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
                            {user.data?.following.groups?.map((g) => (
                              <InlineCard
                                key={g._id}
                                avatar={g.avatar}
                                title={g.displayName}
                                subtitle={`Groupe ${g.type}`}
                                onPress={() =>
                                  navigation.push('Main', {
                                    screen: 'Display',
                                    params: {
                                      screen: 'Group',
                                      params: {
                                        screen: 'Display',
                                        params: { id: g._id, title: g.displayName },
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
                            {user.data.following.users?.map((u) => (
                              <InlineCard
                                key={u._id}
                                avatar={u.info?.avatar}
                                title={u.displayName}
                                onPress={() =>
                                  navigation.push('Main', {
                                    screen: 'Display',
                                    params: {
                                      screen: 'User',
                                      params: {
                                        screen: 'Display',
                                        params: { id: u._id },
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
              <ContentTabView
                articles={articles}
                events={events}
                eventsState={eventsState}
                articlesState={articlesState}
                params={{ authors: [id] }}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <ReportModal
        visible={isUserReportModalVisible}
        setVisible={setUserReportModalVisible}
        contentId={id}
        report={userReport}
        state={state.report}
        navigation={navigation}
      />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { users, account, groups, articles, events } = state;
  return {
    account,
    users,
    state: users.state,
    groups: groups.search,
    groupsState: groups.state,
    articles: articles.search,
    events: events.search,
    articlesState: articles.state,
    eventsState: events.state,
  };
};

export default connect(mapStateToProps)(UserDisplay);
