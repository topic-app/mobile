import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import {
  Text,
  Title,
  Subheading,
  Divider,
  Button,
  List,
  Appbar,
  Menu,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  ContentTabView,
} from '@components';
import { fetchUser } from '@redux/actions/api/users';
import { userFollow, userUnfollow, userReport } from '@redux/actions/apiActions/users';
import { fetchAccount } from '@redux/actions/data/account';
import updatePrefs from '@redux/actions/data/prefs';
import getStyles from '@styles/global';
import {
  Account,
  Address,
  State,
  UsersState,
  UserPreload,
  User,
  UserRequestState,
  PreferencesState,
} from '@ts/types';
import { logger, Format, Errors, shareContent, Alert } from '@utils';

import type { UserDisplayScreenNavigationProp, UserDisplayStackParams } from '.';

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
  preferences: PreferencesState;
};

const UserDisplay: React.FC<UserDisplayProps> = ({
  account,
  users,
  navigation,
  route,
  state,
  preferences,
}) => {
  const { id } = route.params || {};

  React.useEffect(() => {
    if (id !== account.accountInfo?.accountId) {
      fetchUser(id);
    } else {
      fetchAccount();
    }
  }, [id]);

  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [menuVisible, setMenuVisible] = React.useState(false);
  const [isUserReportModalVisible, setUserReportModalVisible] = React.useState(false);

  const user: User | UserPreload | null =
    id === account.accountInfo?.accountId
      ? account.accountInfo.user
      : users.item?._id === id
      ? users.item
      : users.data.find((u) => u._id === id) || users.search.find((u) => u._id === id) || null;

  const following = account.accountInfo?.user?.data?.following?.users?.some((g) => g._id === id);

  const toggleFollow = () => {
    if (following) {
      userUnfollow(id)
        .then(fetchAccount)
        .catch((error) =>
          Errors.showPopup({
            type: 'axios',
            what: "la modification du suivi de l'utilisateur",
            error,
            retry: toggleFollow,
          }),
        );
    } else {
      userFollow(id)
        .then(fetchAccount)
        .catch((error) =>
          Errors.showPopup({
            type: 'axios',
            what: "la modification du suivi de l'utilisateur",
            error,
            retry: toggleFollow,
          }),
        );
    }
  };

  if (!user) {
    return (
      <View style={styles.page}>
        <SafeAreaView style={{ flex: 1 }}>
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
      <SafeAreaView style={{ flex: 1 }}>
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
          <View style={styles.centeredPage}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <PlatformBackButton onPress={navigation.goBack} />
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Appbar.Action
                    icon="dots-vertical"
                    accessibilityLabel="Options supplémentaires"
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
                    shareContent({
                      title: `@${user.info?.username}`,
                      type: 'utilisateurs',
                      id: user._id,
                    });
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
                <Menu.Item
                  key="block"
                  title={preferences.blocked.includes(user._id) ? 'Débloquer' : 'Bloquer'}
                  onPress={() => {
                    if (preferences.blocked.includes(user._id)) {
                      updatePrefs({
                        blocked: preferences.blocked.filter((g) => g !== user._id),
                      });
                    } else {
                      Alert.alert(
                        'Bloquer cet utilisateur ?',
                        'Vous ne verrez plus de contenus écrits par cet utilisateur',
                        [
                          { text: 'Annuler' },
                          {
                            text: 'Bloquer',
                            onPress: () =>
                              updatePrefs({
                                blocked: [...preferences.blocked, user._id],
                              }),
                          },
                        ],
                        { cancelable: true },
                      );
                    }
                  }}
                />
              </Menu>
            </View>

            <View style={[styles.contentContainer, { marginTop: 20 }]}>
              <View style={[styles.centerIllustrationContainer, { marginBottom: 10 }]}>
                <Avatar size={120} avatar={user.info.avatar} imageSize="large" />
              </View>
              <View style={[styles.centerIllustrationContainer, { flexDirection: 'row' }]}>
                {user.data?.public ? (
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Title style={{ textAlign: 'center' }}>{genName(user)}</Title>
                      <View style={{ marginLeft: 5 }}>
                        {user.info.official && (
                          <Icon name="check-decagram" color={colors.primary} size={20} />
                        )}
                      </View>
                    </View>
                    {genName(user) && (
                      <Subheading
                        style={{ textAlign: 'center', marginTop: -10, color: colors.disabled }}
                      >
                        @{user.info.username}
                      </Subheading>
                    )}
                    {preferences.blocked.includes(user._id) ? (
                      <Subheading style={{ textAlign: 'center', color: colors.invalid }}>
                        Utilisateur bloqué
                      </Subheading>
                    ) : null}
                  </View>
                ) : (
                  <Title style={{ textAlign: 'center' }}>@{user.info.username}</Title>
                )}
              </View>
            </View>
            {state.info.loading && (
              <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
            {(state.info.success || id === account.accountInfo?.accountId) && !user.preload && (
              <View>
                <Divider style={{ marginVertical: 10 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 40 }}>
                      {typeof user.data?.cache?.followers === 'number'
                        ? user.data.cache.followers
                        : ' '}
                    </Text>
                    <Text>Abonnés </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 40 }}>
                      {typeof user.data?.cache?.following === 'number'
                        ? user.data.cache.following
                        : ' '}
                    </Text>
                    <Text>Abonnements </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 40 }}>
                      {typeof user.data?.cache?.groups?.length === 'number'
                        ? user.data.cache.groups.length
                        : ' '}
                    </Text>
                    <Text>Groupes</Text>
                  </View>
                </View>
                <Divider style={{ marginVertical: 10 }} />
                {!user.data?.public && (
                  <View>
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
                    <View style={{ height: 10 }} />
                  </View>
                )}
                {account.loggedIn &&
                  (account.accountInfo.accountId !== user._id ? (
                    <View style={styles.container}>
                      <Button
                        loading={state.follow?.loading || account.state.fetchAccount.loading}
                        mode={following ? 'outlined' : 'contained'}
                        style={{
                          backgroundColor: following ? colors.surface : colors.primary,
                          borderRadius: 20,
                        }}
                        onPress={toggleFollow}
                      >
                        {following ? 'Abonné' : "S'abonner"}
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
                {(user.data?.public || id === account.accountInfo?.accountId) &&
                  !!user.data?.description && (
                    <View>
                      <List.Subheader>Biographie</List.Subheader>
                      <Divider />
                      <View
                        style={{
                          alignItems: 'stretch',
                          marginTop: 5,
                          marginBottom: 20,
                          marginHorizontal: 10,
                        }}
                      >
                        <Text>{user.data.description}</Text>
                      </View>
                      <View style={{ height: 20 }} />
                    </View>
                  )}
                {!!user.data?.cache?.groups?.length && (
                  <View>
                    <List.Subheader>Groupes</List.Subheader>
                    <Divider />
                    {user.data?.cache?.groups?.map((group) => (
                      <InlineCard
                        key={group._id}
                        avatar={group.avatar}
                        title={group.displayName || group.name}
                        subtitle={`Groupe ${group.type}`}
                        onPress={() =>
                          navigation.push('Root', {
                            screen: 'Main',
                            params: {
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
                            },
                          })
                        }
                      />
                    ))}
                    <View style={{ height: 20 }} />
                  </View>
                )}
                {(user.data?.public || id === account.accountInfo?.accountId) && (
                  <View>
                    <List.Subheader>Localisation</List.Subheader>
                    <Divider />
                    <View style={{ marginVertical: 10 }}>
                      {user.data.location?.global && (
                        <InlineCard icon="map-marker" title="France Entière" />
                      )}
                      {user.data.location?.schools?.map((school) => (
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
                        />
                      ))}
                      {user.data.location?.departments?.map((dep) => (
                        <InlineCard
                          key={dep._id}
                          icon="map-marker-radius"
                          title={dep.name}
                          subtitle={`${dep.type === 'departement' ? 'Département' : 'Région'}`}
                        />
                      ))}
                    </View>
                    <View style={{ height: 20 }} />
                  </View>
                )}
                {(user.data?.public || account.accountInfo?.accountId === id) && (
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
                              {!user.data?.following?.groups?.length && (
                                <View
                                  style={[styles.centerIllustrationContainer, styles.container]}
                                >
                                  <Text>Aucun abonnement à un groupe</Text>
                                </View>
                              )}
                              {user.data?.following?.groups?.map((g) => (
                                <InlineCard
                                  key={g._id}
                                  avatar={g.avatar}
                                  title={g.displayName || g.name}
                                  subtitle={`Groupe ${g.type}`}
                                  onPress={() =>
                                    navigation.push('Root', {
                                      screen: 'Main',
                                      params: {
                                        screen: 'Display',
                                        params: {
                                          screen: 'Group',
                                          params: {
                                            screen: 'Display',
                                            params: { id: g._id, title: g.displayName },
                                          },
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
                              {!user.data?.following?.users?.length && (
                                <View
                                  style={[styles.centerIllustrationContainer, styles.container]}
                                >
                                  <Text>Aucun abonnement à un utilisateur</Text>
                                </View>
                              )}
                              {user.data.following?.users?.map((u) => (
                                <InlineCard
                                  key={u._id}
                                  avatar={u.info?.avatar}
                                  title={u.displayName}
                                  subtitle={
                                    u.displayName === u.info?.username
                                      ? undefined
                                      : `@${u.info?.username}`
                                  }
                                  onPress={() =>
                                    navigation.push('Root', {
                                      screen: 'Main',
                                      params: {
                                        screen: 'Display',
                                        params: {
                                          screen: 'User',
                                          params: {
                                            screen: 'Display',
                                            params: { id: u._id },
                                          },
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
                <ContentTabView searchParams={{ authors: [id] }} />
              </View>
            )}
          </View>
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
  const { users, account, groups, preferences } = state;
  return {
    account,
    users,
    state: users.state,
    groups: groups.search,
    groupsState: groups.state,
    preferences,
  };
};

export default connect(mapStateToProps)(UserDisplay);
