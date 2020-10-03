import React from 'react';
import {
  ScrollView,
  View,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
  Share,
  FlatList,
} from 'react-native';
import {
  Button,
  Text,
  Paragraph,
  useTheme,
  Divider,
  Menu,
  Appbar,
  Subheading,
  Title,
  IconButton,
  Banner,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import {
  GroupPreload,
  Group,
  Account,
  Address,
  GroupRequestState,
  GroupsState,
  State,
  ArticleRequestState,
  Article,
} from '@ts/types';
import {
  Avatar,
  InlineCard,
  CategoryTitle,
  ReportModal,
  PlatformBackButton,
  TranslucentStatusBar,
  CustomTabView,
  ArticleCard,
  PlatformTouchable,
  Content,
  CollapsibleView,
  ErrorMessage,
  SafeAreaView,
} from '@components/index';
import getStyles from '@styles/Styles';
import { fetchGroup } from '@redux/actions/api/groups';
import { searchArticles } from '@redux/actions/api/articles';
import {
  groupFollow,
  groupUnfollow,
  groupReport,
  groupMemberDelete,
  groupMemberLeave,
} from '@redux/actions/apiActions/groups';
import { fetchAccount, fetchGroups } from '@redux/actions/data/account';

import AddUserSelectModal from '../components/AddUserSelectModal';
import AddUserRoleModal from '../components/AddUserRoleModal';
import EditGroupModal from '../components/EditGroupModal';
import EditGroupDescriptionModal from '../components/EditGroupDescriptionModal';

function getAddressString(address: Address) {
  const { number, street, city, code } = address?.address || {};
  if (number && street && city && code) {
    return `${number} ${street}, ${code} ${city}`;
  }
  if (city) return city;
  return null;
}

type GroupElement = Group | GroupPreload;
type GroupDisplayProps = {
  groups: GroupsState;
  account: Account;
  state: GroupRequestState;
  articles: Article[];
  articlesState: ArticleRequestState;
};

function GroupDisplay({
  route,
  navigation,
  groups,
  account,
  state,
  accountState,
  articles,
  articlesState,
}: GroupDisplayProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  // Pour changer le type de route.params, voir ../index.tsx
  const { id } = route.params;
  React.useEffect(() => {
    fetchGroup(id);
    searchArticles('initial', '', { groups: [id] }, false);
  }, [null]);

  const group =
    groups.item?._id === id
      ? groups.item
      : groups.data.find((g) => g._id === id) || groups.search.find((g) => g._id === id) || null;

  const following =
    account.loggedIn && account.accountInfo.user.data.following.groups.some((g) => g._id === id);

  const toggleFollow = () => {
    if (following) {
      groupUnfollow(id).then(fetchAccount);
    } else {
      groupFollow(id).then(fetchAccount);
    }
  };

  const leave = () => {
    Alert.alert(
      `Quitter le groupe ${group?.name} ?`,
      'Vous ne pourrez plus le rejoindre sans invitation.',
      [
        {
          text: 'Annuler',
        },
        {
          text: 'Quitter',
          onPress: () =>
            groupMemberLeave(id).then(() => {
              fetchGroup(id);
              fetchGroups();
            }),
        },
      ],
      { cancelable: true },
    );
  };

  const [menuVisible, setMenuVisible] = React.useState(false);

  const [isGroupReportModalVisible, setGroupReportModalVisible] = React.useState(false);

  const [isAddUserModalVisible, setAddUserModalVisible] = React.useState(false);
  const [isAddUserRoleModalVisible, setAddUserRoleModalVisible] = React.useState(false);
  const [currentMembers, setCurrentMembers] = React.useState([]);
  const [currentRoles, setCurrentRoles] = React.useState([]);
  const [userToAdd, setUserToAdd] = React.useState(null);

  const [isAddSnackbarVisible, setAddSnackbarVisible] = React.useState(false);

  const [editingGroup, setEditingGroup] = React.useState(null);
  const [isEditGroupModalVisible, setEditGroupModalVisible] = React.useState(false);
  const [isEditGroupDescriptionModalVisible, setEditGroupDescriptionModalVisible] = React.useState(
    false,
  );
  const [descriptionVisible, setDescriptionVisible] = React.useState(false);

  if (!group) {
    // This is when article has not been loaded in list, so we have absolutely no info
    return (
      <View style={styles.page}>
        <SafeAreaView>
          <PlatformBackButton onPress={navigation.goBack} />

          {state.info.error && (
            <ErrorMessage
              type="axios"
              strings={{
                what: 'la récupération de ce groupe',
                contentSingular: 'Le groupe',
              }}
              error={state.info.error}
              retry={() => groupMemberDelete(id, mem.user?._id).then(() => fetchGroup(id))}
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
              what: 'la récupération de ce groupe',
              contentSingular: 'Le groupe',
            }}
            error={state.info.error}
            retry={() => fetchGroup(id)}
          />
        )}
        {state.follow.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la modification du suivi',
              contentSingular: 'le suivi',
            }}
            error={state.info.error}
          />
        )}
        {state.member_delete?.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la suppression du membre',
              contentSingular: "L'utilisateur",
            }}
            error={state.member_delete?.error}
            retry={() => fetchGroup(id)}
          />
        )}
        {state.member_leave?.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la procéure pour quitter le groupe',
              contentSingular: 'La prodédure pour quitter le groupe',
            }}
            error={state.member_leave?.error}
            retry={leave}
          />
        )}
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <PlatformBackButton onPress={navigation.goBack} />
            <View style={{ flexDirection: 'row' }}>
              {account.loggedIn &&
                account.permissions?.some(
                  (p) =>
                    p.permission === 'group.modify' &&
                    (p.scope?.groups?.includes(id) || (p.group === id && p?.scope?.self)),
                ) && (
                  <IconButton
                    icon="pencil"
                    onPress={() => {
                      setEditingGroup({
                        shortName: group.shortName,
                        summary: group.summary,
                        description: group.description?.data,
                      });
                      setEditGroupModalVisible(true);
                    }}
                  />
                )}
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
                        message: `Groupe ${group?.shortName || group?.name}`,
                        url: `https://go.topicapp.fr/groupes/${group?._id}`,
                      });
                    } else {
                      Share.share({
                        message: `https://go.topicapp.fr/groupes/${group?._id}`,
                        title: `Groupe ${group?.shortName || group?.name}`,
                      });
                    }
                  }}
                />
                <Menu.Item
                  key="report"
                  title="Signaler"
                  onPress={() => {
                    setMenuVisible(false);
                    setGroupReportModalVisible(true);
                  }}
                />
              </Menu>
            </View>
          </View>

          <View style={[styles.contentContainer, { marginTop: 20 }]}>
            <View style={[styles.centerIllustrationContainer, { marginBottom: 10 }]}>
              <Avatar size={120} avatar={group?.avatar} />
            </View>
            <View style={[styles.centerIllustrationContainer, { flexDirection: 'row' }]}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Title>{group?.name}</Title>
                  <View style={{ marginLeft: 5 }}>
                    {group?.official && (
                      <Icon name="check-decagram" color={colors.primary} size={20} />
                    )}
                  </View>
                </View>
                {!!group?.shortName && (
                  <Subheading style={{ marginTop: -10, color: colors.disabled }}>
                    {group.shortName}
                  </Subheading>
                )}
                <Subheading style={{ marginTop: -10, color: colors.disabled }}>
                  Groupe {group?.type}
                </Subheading>
              </View>
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
                  <Text style={{ fontSize: 40 }}>{group.cache.followers || ''}</Text>
                  <Text>Abonnés </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 40 }}>{group.members?.length}</Text>
                  <Text>Membres </Text>
                </View>
              </View>
              <Divider style={{ marginVertical: 10 }} />
              {account.loggedIn && (
                <View style={{ flexDirection: 'row' }}>
                  {account.groups?.some((g) => g._id === group._id) && (
                    <View style={[styles.container, { flexGrow: 1 }]}>
                      <Button
                        mode="outlined"
                        uppercase={Platform.OS !== 'ios'}
                        style={{ borderRadius: 20 }}
                        loading={state.member_leave?.loading}
                        onPress={leave}
                      >
                        Quitter
                      </Button>
                    </View>
                  )}
                  <View style={[styles.container, { flexGrow: 1 }]}>
                    <Button
                      loading={state.follow?.loading}
                      mode={following ? 'outlined' : 'contained'}
                      uppercase={Platform.OS !== 'ios'}
                      style={{
                        backgroundColor: following ? colors.surface : colors.primary,
                        borderRadius: 20,
                      }}
                      onPress={toggleFollow}
                    >
                      {following ? 'Abonné' : "S'abonner"}
                    </Button>
                  </View>
                </View>
              )}
              <PlatformTouchable onPress={() => setDescriptionVisible(!descriptionVisible)}>
                <View style={styles.container}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexGrow: 1 }}>
                      <Paragraph style={{ color: colors.disabled }}>Groupe {group?.type}</Paragraph>
                      <Paragraph numberOfLines={5}>{group?.summary}</Paragraph>
                    </View>
                    {account.loggedIn &&
                      account.permissions?.some(
                        (p) =>
                          p.permission === 'group.modify' &&
                          (p.scope?.groups?.includes(id) || (p.group === id && p?.scope?.self)),
                      ) && (
                        <View onResponderTerminationRequest={() => false}>
                          <IconButton
                            icon="pencil-outline"
                            onPress={() => {
                              setEditingGroup({
                                shortName: group.shortName,
                                summary: group.summary,
                                description: group.description?.data,
                              });
                              setEditGroupDescriptionModalVisible(true);
                            }}
                          />
                        </View>
                      )}
                  </View>
                  {group?.description?.data ? (
                    <View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ color: colors.disabled, alignSelf: 'center' }}>
                            Voir la description complète
                          </Text>
                          <Icon
                            name={descriptionVisible ? 'chevron-down' : 'chevron-right'}
                            color={colors.disabled}
                            size={23}
                          />
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              </PlatformTouchable>
              <CollapsibleView collapsed={!descriptionVisible}>
                <View style={styles.contentContainer}>
                  <Content parser={group?.description?.parser} data={group?.description?.data} />
                </View>
              </CollapsibleView>
              <Divider />
              {group?.location.global && (
                <InlineCard
                  icon="map-marker"
                  title="France Entière"
                  onPress={() => console.log('global pressed')}
                />
              )}
              {group?.location.schools?.map((school) => (
                <InlineCard
                  key={school._id}
                  icon="school"
                  title={school.displayName}
                  subtitle={getAddressString(school?.address) || school?.shortName}
                  onPress={() => console.log(`school ${school._id} pressed!`)}
                />
              ))}
              {group?.location.departments?.map((dep) => (
                <InlineCard
                  key={dep._id}
                  icon="domain"
                  title={dep.displayName}
                  subtitle="Département"
                  onPress={() => console.log(`department ${dep._id} pressed!`)}
                />
              ))}
              <Divider />
              <View style={styles.container}>
                <CategoryTitle>Membres</CategoryTitle>
              </View>
              <Banner visible={isAddSnackbarVisible} actions={[]}>
                Une invitation a été envoyée à @{userToAdd?.info?.username}
              </Banner>
              {account.loggedIn &&
                group.members?.some((m) => m.user?._id === account.accountInfo?.accountId) && (
                  <View>
                    <InlineCard
                      key="Me"
                      title={`Moi (@${account.accountInfo?.user?.info?.username})`}
                      subtitle={`Role ${
                        group.roles?.find(
                          (r) =>
                            r._id ===
                            group.members?.find(
                              (m) => m.user?._id === account.accountInfo?.accountId,
                            )?.role,
                        )?.name
                      }`}
                      badge={
                        group.roles?.find(
                          (r) =>
                            r._id ===
                            group.members?.find(
                              (m) => m.user?._id === account.accountInfo?.accountId,
                            )?.role,
                        )?.admin
                          ? 'star'
                          : null
                      }
                      badgeColor={colors.solid.gold}
                      avatar={account.accountInfo?.user?.info?.avatar}
                    />
                    <Divider />
                  </View>
                )}
              {group.members
                ?.filter((m) => m.user?._id !== account.accountInfo?.accountId)
                ?.map((mem) => (
                  <View
                    key={mem._id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ flexGrow: 1 }}>
                      <InlineCard
                        key={mem._id}
                        title={mem.user?.displayName}
                        subtitle={`${
                          mem.user?.data?.public ? `@${mem.user?.info?.username} - ` : ''
                        }${group.roles?.find((r) => r._id === mem.role)?.name}`}
                        badge={group.roles?.find((r) => r._id === mem.role)?.admin ? 'star' : null}
                        badgeColor={colors.solid.gold}
                        avatar={mem.user?.info?.avatar}
                        onPress={() =>
                          navigation.navigate('Main', {
                            screen: 'Display',
                            params: {
                              screen: 'User',
                              params: {
                                screen: 'Display',
                                params: {
                                  id: mem.user?._id,
                                },
                              },
                            },
                          })
                        }
                      />
                    </View>
                    {account.loggedIn &&
                      account.permissions?.some(
                        (p) =>
                          p.permission === 'group.members.delete' &&
                          (p.scope?.groups?.includes(id) || (p.group === id && p?.scope?.self)),
                      ) &&
                      (state.member_delete?.loading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                      ) : (
                        <IconButton
                          icon="delete"
                          onPress={() => {
                            Alert.alert(
                              `Retirer @${mem.user?.info?.username} de ${group.name} ?`,
                              'Cette action sera publiquement visible.',
                              [
                                {
                                  text: 'Annuler',
                                },
                                {
                                  text: 'Retirer',
                                  onPress: () => {
                                    groupMemberDelete(id, mem.user?._id).then(() => fetchGroup(id));
                                  },
                                },
                              ],
                              { cancelable: true },
                            );
                          }}
                          size={30}
                          style={{ marginRight: 20 }}
                        />
                      ))}
                  </View>
                ))}
              {account.loggedIn &&
                account.permissions?.some(
                  (p) =>
                    p.permission === 'group.members.add' &&
                    (p.scope?.groups?.includes(id) || (p.group === id && p?.scope?.self)),
                ) && (
                  <View style={styles.container}>
                    <Button
                      mode="outlined"
                      uppercase={Platform.OS !== 'ios'}
                      onPress={() => {
                        setCurrentMembers(group.members || []);
                        setCurrentRoles(group.roles || []);
                        setAddUserModalVisible(true);
                      }}
                    >
                      Ajouter
                    </Button>
                  </View>
                )}
              <View style={{ height: 40 }} />
              {articles.length !== 0 && (
                <View>
                  <View style={styles.container}>
                    <CategoryTitle>Derniers contenus</CategoryTitle>
                  </View>
                  <Divider />
                  <CustomTabView
                    scrollEnabled={false}
                    pages={[
                      ...(articles.length
                        ? [
                            {
                              key: 'articles',
                              title: 'Articles',
                              component: (
                                <View>
                                  {articlesState.search?.error && (
                                    <ErrorMessage
                                      type="axios"
                                      strings={{
                                        what: 'le chargement des articles',
                                        contentPlural: 'les articles',
                                      }}
                                      error={articlesState.search?.error}
                                      retry={() =>
                                        searchArticles('initial', '', { authors: [id] }, false)
                                      }
                                    />
                                  )}
                                  {articlesState.search?.loading.initial && (
                                    <View style={styles.container}>
                                      <ActivityIndicator size="large" color={colors.primary} />
                                    </View>
                                  )}
                                  {articlesState.search?.success && (
                                    <FlatList
                                      data={articles}
                                      keyExtractor={(i) => i._id}
                                      ListFooterComponent={
                                        articlesState.search.loading.initial ? (
                                          <View style={[styles.container, { height: 50 }]}>
                                            <ActivityIndicator
                                              size="large"
                                              color={colors.primary}
                                            />
                                          </View>
                                        ) : null
                                      }
                                      renderItem={({ item }: { item: Article }) => (
                                        <ArticleCard
                                          article={item}
                                          unread
                                          navigate={() =>
                                            navigation.navigate('Main', {
                                              screen: 'Display',
                                              params: {
                                                screen: 'Article',
                                                params: {
                                                  screen: 'Display',
                                                  params: {
                                                    id: item._id,
                                                    title: item.title,
                                                    useLists: false,
                                                  },
                                                },
                                              },
                                            })
                                          }
                                        />
                                      )}
                                    />
                                  )}
                                </View>
                              ),
                            },
                          ]
                        : []),
                    ]}
                  />
                  <View style={{ height: 20 }} />
                </View>
              )}
            </View>
          )}
        </ScrollView>

        <ReportModal
          visible={isGroupReportModalVisible}
          setVisible={setGroupReportModalVisible}
          contentId={id}
          report={groupReport}
          state={state.report}
        />

        <AddUserSelectModal
          visible={isAddUserModalVisible}
          setVisible={setAddUserModalVisible}
          members={currentMembers}
          next={(user) => {
            setUserToAdd(user);
            setAddUserRoleModalVisible(true);
          }}
        />

        <AddUserRoleModal
          visible={isAddUserRoleModalVisible}
          setVisible={setAddUserRoleModalVisible}
          roles={currentRoles}
          user={userToAdd}
          group={id}
          next={() => {
            setAddSnackbarVisible(true);
          }}
        />

        <EditGroupModal
          visible={isEditGroupModalVisible}
          setVisible={setEditGroupModalVisible}
          group={group}
          editingGroup={editingGroup}
          setEditingGroup={setEditingGroup}
        />

        <EditGroupDescriptionModal
          visible={isEditGroupDescriptionModalVisible}
          setVisible={setEditGroupDescriptionModalVisible}
          group={group}
          editingGroup={editingGroup}
          setEditingGroup={setEditingGroup}
        />
      </SafeAreaView>
    </View>
  );
}

const mapStateToProps = (state: State) => {
  const { groups, account, articles } = state;
  return {
    groups,
    account,
    articles: articles.search,
    articlesState: articles.state,
    state: groups.state,
    accountState: account.state,
  };
};

export default connect(mapStateToProps)(GroupDisplay);
