import { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  ScrollView,
  View,
  Platform,
  ActivityIndicator,
  StatusBar,
  Share,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Text,
  Paragraph,
  Divider,
  Menu,
  Appbar,
  Subheading,
  Title,
  IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import {
  Avatar,
  InlineCard,
  CategoryTitle,
  ReportModal,
  PlatformBackButton,
  TranslucentStatusBar,
  PlatformTouchable,
  Content,
  CollapsibleView,
  ErrorMessage,
  SafeAreaView,
  Banner,
} from '@components/index';
import { Permissions } from '@constants/index';
import { searchArticles } from '@redux/actions/api/articles';
import { searchEvents } from '@redux/actions/api/events';
import { fetchGroup, fetchGroupVerification } from '@redux/actions/api/groups';
import {
  groupFollow,
  groupUnfollow,
  groupReport,
  groupMemberDelete,
  groupMemberLeave,
  groupVerificationApprove,
} from '@redux/actions/apiActions/groups';
import { fetchAccount, fetchGroups } from '@redux/actions/data/account';
import getStyles from '@styles/Styles';
import {
  GroupPreload,
  Group,
  Account,
  GroupRequestState,
  GroupsState,
  State,
  ArticleRequestState,
  EventRequestState,
  EventPreload,
  ArticlePreload,
  AccountRequestState,
  User,
  GroupMember,
  GroupRole,
  UserPreload,
  GroupVerification,
  Avatar as AvatarType,
} from '@ts/types';
import { useTheme, logger, Format, checkPermission, Alert } from '@utils/index';

import ContentTabView from '../../components/ContentTabView';
import AddUserRoleModal from '../components/AddUserRoleModal';
import AddUserSelectModal from '../components/AddUserSelectModal';
import ChangeGroupLocationModal from '../components/ChangeGroupLocationModal';
import EditGroupDescriptionModal from '../components/EditGroupDescriptionModal';
import type { GroupDisplayStackParams, GroupDisplayScreenNavigationProp } from '../index';

type GroupDisplayProps = {
  navigation: GroupDisplayScreenNavigationProp<'Display'>;
  route: RouteProp<GroupDisplayStackParams, 'Display'>;
  groups: GroupsState;
  account: Account;
  state: GroupRequestState;
  articles: ArticlePreload[];
  accountState: AccountRequestState;
  articlesState: ArticleRequestState;
  events: EventPreload[];
  eventsState: EventRequestState;
};

const GroupDisplay: React.FC<GroupDisplayProps> = ({
  route,
  navigation,
  groups,
  account,
  state,
  accountState,
  articles,
  events,
  articlesState,
  eventsState,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  // Pour changer le type de route.params, voir ../index.tsx
  const { id, verification } = route.params;

  const fetch = verification ? () => fetchGroupVerification(id) : () => fetchGroup(id);

  React.useEffect(() => {
    fetch();
    searchArticles('initial', '', { groups: [id] }, false);
    searchEvents('initial', '', { groups: [id] }, false);
  }, [null]);

  const group: Group | GroupPreload | GroupVerification | null =
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
              fetch();
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
  const [currentMembers, setCurrentMembers] = React.useState<GroupMember[]>([]);
  const [currentRoles, setCurrentRoles] = React.useState<GroupRole[]>([]);
  const [userToAdd, setUserToAdd] = React.useState<User | UserPreload | null>(null);
  const [modifying, setModifying] = React.useState(false);

  const [isAddSnackbarVisible, setAddSnackbarVisible] = React.useState(false);

  const [legalCollapsed, setLegalCollapsed] = React.useState(true);

  const [editingGroup, setEditingGroup] = React.useState<{
    id?: string;
    name?: string;
    summary?: string;
    description?: string;
    avatar?: AvatarType;
  } | null>(null);
  const [isEditGroupDescriptionModalVisible, setEditGroupDescriptionModalVisible] = React.useState(
    false,
  );
  const [isChangeGroupLocationModalVisible, setChangeGroupLocationModalVisible] = React.useState(
    false,
  );
  const [descriptionVisible, setDescriptionVisible] = React.useState(verification || false);

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
              retry={() => fetch()}
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
            retry={fetch}
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
          />
        )}
        {state.member_leave?.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la procédure pour quitter le groupe',
              contentSingular: 'La procédure pour quitter le groupe',
            }}
            error={state.member_leave?.error}
            retry={leave}
          />
        )}
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <PlatformBackButton onPress={navigation.goBack} />
            <View style={{ flexDirection: 'row' }}>
              {!group.preload &&
                checkPermission(account, {
                  permission: Permissions.GROUP_MODIFY,
                  scope: { groups: [id] },
                }) && (
                  <IconButton
                    icon="pencil"
                    onPress={() => {
                      setEditingGroup({
                        id: group._id,
                        name: group.name,
                        summary: group.summary,
                        description: group.description?.data,
                        avatar: group.avatar,
                      });
                      setEditGroupDescriptionModalVisible(true);
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
                        message: `Groupe ${group.shortName || group.name}`,
                        url: `https://go.topicapp.fr/groupes/${group._id}`,
                      });
                    } else {
                      Share.share({
                        message: `https://go.topicapp.fr/groupes/${group._id}`,
                        title: `Groupe ${group.shortName || group.name}`,
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
              <Avatar
                size={120}
                avatar={group.avatar}
                imageSize="large"
                onPress={
                  group.avatar?.type === 'image'
                    ? () =>
                        group.avatar?.type === 'image' &&
                        navigation.push('Main', {
                          screen: 'Display',
                          params: {
                            screen: 'Image',
                            params: {
                              screen: 'Display',
                              params: { image: group.avatar?.image?.image },
                            },
                          },
                        })
                    : undefined
                }
              />
            </View>
            <View style={[styles.centerIllustrationContainer, { flexDirection: 'row' }]}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Title>{group.name}</Title>
                  <View style={{ marginLeft: 5 }}>
                    {group.official && (
                      <Icon name="check-decagram" color={colors.primary} size={20} />
                    )}
                  </View>
                </View>
                {!!group.shortName && (
                  <Subheading style={{ marginTop: -10, color: colors.disabled }}>
                    {group.shortName}
                  </Subheading>
                )}
                <Subheading style={{ marginTop: -10, color: colors.disabled }}>
                  Groupe {group.type}
                </Subheading>
              </View>
            </View>
          </View>
          {state.info.loading && (
            <View style={styles.container}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          {state.info.success && !group.preload && (
            <View>
              {!verification && (
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
                          loading={state.follow?.loading || accountState.fetchAccount.loading}
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
                </View>
              )}
              <PlatformTouchable
                onPress={
                  group.description?.data
                    ? () => setDescriptionVisible(!descriptionVisible)
                    : undefined
                }
              >
                <View style={styles.container}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Paragraph style={{ color: colors.disabled }}>Groupe {group.type}</Paragraph>
                      <Paragraph numberOfLines={5}>{group.summary}</Paragraph>
                    </View>
                  </View>
                  {group.description?.data ? (
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
                  <Content parser={group.description?.parser} data={group.description?.data} />
                </View>
              </CollapsibleView>
              <Divider />
              {group.location.global && (
                <InlineCard
                  icon="map-marker"
                  title="France Entière"
                  onPress={() => logger.warn('global pressed')}
                />
              )}
              {group.location.schools?.map((school) => (
                <InlineCard
                  key={school._id}
                  icon="school"
                  title={school.name}
                  subtitle={
                    school?.address ? Format.shortAddress(school.address) : school?.shortName
                  }
                  onPress={() => logger.warn(`school ${school._id} pressed!`)}
                />
              ))}
              {group.location.departments?.map((dep) => (
                <InlineCard
                  key={dep._id}
                  icon="domain"
                  title={dep.displayName}
                  subtitle="Département"
                  onPress={() => logger.warn(`department ${dep._id} pressed!`)}
                />
              ))}
              <Divider />
              {checkPermission(account, {
                permission: Permissions.GROUP_MODIFY_LOCATION,
                scope: { groups: [id] },
              }) && (
                <View>
                  <View style={styles.container}>
                    <Button
                      mode="outlined"
                      uppercase={Platform.OS !== 'ios'}
                      onPress={() => {
                        setChangeGroupLocationModalVisible(true);
                      }}
                    >
                      Changer
                    </Button>
                  </View>
                  <Divider />
                </View>
              )}
              <View style={styles.container}>
                <CategoryTitle>Membres</CategoryTitle>
              </View>
              <Banner visible={isAddSnackbarVisible} actions={[]}>
                Une invitation a été envoyée à @${userToAdd?.info?.username || ''}
              </Banner>
              {account.loggedIn &&
                group.members?.some((m) => m.user?._id === account.accountInfo?.accountId) && (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <InlineCard
                          title={`Moi (@${account.accountInfo?.user?.info?.username})`}
                          subtitle={`Role ${
                            group.roles?.find(
                              (r) =>
                                r._id ===
                                group.members?.find(
                                  (m) => m.user?._id === account.accountInfo?.accountId,
                                )?.role,
                            )?.name
                          }${group.roles
                            ?.filter((r) =>
                              group.members
                                ?.find((m) => m.user?._id === account.accountInfo?.accountId)
                                ?.secondaryRoles?.includes(r._id),
                            )
                            ?.map((r) => `, ${r?.name}`)
                            .join('')}`}
                          badge={
                            group.roles?.find(
                              (r) =>
                                r._id ===
                                group.members?.find(
                                  (m) => m.user?._id === account.accountInfo?.accountId,
                                )?.role,
                            )?.admin
                              ? 'star'
                              : undefined
                          }
                          badgeColor={colors.solid.gold}
                          avatar={account.accountInfo?.user?.info?.avatar}
                        />
                      </View>
                      {checkPermission(account, {
                        permission: Permissions.GROUP_MEMBERS_MODIFY,
                        scope: { groups: [id] },
                      }) &&
                        (state.member_modify?.loading &&
                        userToAdd?._id === account.accountInfo.accountId ? (
                          <ActivityIndicator size="large" color={colors.primary} />
                        ) : (
                          <IconButton
                            icon="pencil"
                            onPress={() => {
                              setCurrentMembers(group.members || []);
                              setCurrentRoles(group.roles || []);
                              setUserToAdd(account.accountInfo.user);
                              setModifying(true);
                              setAddUserRoleModalVisible(true);
                            }}
                            size={30}
                            style={{ marginRight: 20 }}
                          />
                        ))}
                    </View>
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
                    <View style={{ flex: 1 }}>
                      <InlineCard
                        key={mem._id}
                        title={mem.user?.displayName}
                        subtitle={`${
                          mem.user?.data?.public ? `@${mem.user?.info?.username} - ` : ''
                        }${group.roles?.find((r) => mem.role === r._id)?.name}${group.roles
                          ?.filter((r) => mem.secondaryRoles?.includes(r._id))
                          ?.map((r) => `, ${r?.name}`)
                          .join('')}`}
                        subtitleNumberOfLines={2}
                        badge={
                          group.roles?.find((r) => r._id === mem.role)?.admin ? 'star' : undefined
                        }
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
                    {checkPermission(account, {
                      permission: Permissions.GROUP_MEMBERS_MODIFY,
                      scope: { groups: [id] },
                    }) &&
                      (state.member_modify?.loading && userToAdd?._id === mem.user?._id ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                      ) : (
                        <IconButton
                          icon="pencil"
                          onPress={() => {
                            setCurrentMembers(group.members || []);
                            setCurrentRoles(group.roles || []);
                            setUserToAdd(mem.user);
                            setModifying(true);
                            setAddUserRoleModalVisible(true);
                          }}
                          size={30}
                          style={{ marginRight: 20 }}
                        />
                      ))}
                    {checkPermission(account, {
                      permission: Permissions.GROUP_MEMBERS_DELETE,
                      scope: { groups: [id] },
                    }) &&
                      (state.member_delete?.loading && userToAdd?._id === mem.user?._id ? (
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
                                    groupMemberDelete(id, mem.user?._id).then(fetch);
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
              {checkPermission(account, {
                permission: Permissions.GROUP_MEMBERS_ADD,
                scope: { groups: [id] },
              }) && (
                <View style={styles.container}>
                  <Button
                    mode="outlined"
                    uppercase={Platform.OS !== 'ios'}
                    onPress={() => {
                      setCurrentMembers(group.members || []);
                      setCurrentRoles(group.roles || []);
                      setModifying(false);
                      setAddUserModalVisible(true);
                    }}
                  >
                    Ajouter
                  </Button>
                </View>
              )}
              <View>
                <Divider style={{ marginBottom: 20 }} />
                <View style={styles.contentContainer}>
                  <TouchableOpacity onPress={() => setLegalCollapsed(!legalCollapsed)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Title style={{ color: colors.subtext }}>Informations légales</Title>
                      <Icon
                        name={legalCollapsed ? 'chevron-down' : 'chevron-up'}
                        size={24}
                        color={colors.subtext}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <CollapsibleView collapsed={legalCollapsed && !verification}>
                  <View style={styles.contentContainer}>
                    <Divider style={{ marginBottom: 20 }} />
                    <Subheading>Nom complet</Subheading>
                    <Text>{group.legal?.name || 'Non spécifié'}</Text>
                    <Divider style={{ marginVertical: 20 }} />
                    <Subheading>Identifiant</Subheading>
                    <Text>{group.legal?.id || 'Non spécifié'}</Text>
                    <Divider style={{ marginVertical: 20 }} />
                    <Subheading>Responsable légal</Subheading>
                    <Text>{group.legal?.admin}</Text>
                    <Divider style={{ marginVertical: 20 }} />
                    <Subheading>Siège social</Subheading>
                    <Text>{group.legal?.address || 'Non spécifié'}</Text>
                    <Divider style={{ marginVertical: 20 }} />
                    <Subheading>Adresse email</Subheading>
                    <Text>{group.legal?.email}</Text>
                    <Divider style={{ marginVertical: 20 }} />
                    <Subheading>Site web</Subheading>
                    <Text>{group.legal?.website || 'Non spécifié'}</Text>
                    <Divider style={{ marginVertical: 20 }} />
                    {group.legal?.extra ? (
                      <View>
                        <Subheading>Données supplémentaires</Subheading>
                        <Text>{group.legal?.extra}</Text>
                        <Divider style={{ marginVertical: 20 }} />
                      </View>
                    ) : null}
                  </View>
                </CollapsibleView>
              </View>
              <View style={{ height: 20 }} />
              {!verification && (
                <ContentTabView
                  articles={articles}
                  events={events}
                  eventsState={eventsState}
                  articlesState={articlesState}
                  params={{ groups: [id] }}
                  key={id}
                />
              )}
              {verification && (
                <View>
                  <Divider style={{ marginTop: 30 }} />
                  <View style={styles.contentContainer}>
                    <Subheading>Données de vérification supplémentaires</Subheading>
                    <Text>
                      {(group as GroupVerification).verification?.data?.extra || 'Non spécifié'}
                    </Text>
                  </View>
                  <View style={{ height: 30 }} />
                  {state.verification_approve?.error && (
                    <ErrorMessage
                      type="axios"
                      strings={{
                        what: "l'approbation du groupe",
                        contentSingular: 'le groupe',
                      }}
                      error={state.verification_approve?.error}
                      retry={() =>
                        groupVerificationApprove(group._id).then(() => navigation.goBack())
                      }
                    />
                  )}
                  <View
                    style={[
                      styles.container,
                      { flexDirection: 'row', justifyContent: 'space-evenly' },
                    ]}
                  >
                    <Button
                      mode="outlined"
                      loading={state.verification_delete?.loading}
                      color={colors.invalid}
                      contentStyle={{
                        height: 50,
                        justifyContent: 'center',
                      }}
                      onPress={() =>
                        Alert.alert(
                          'Supprimer ce groupe ?',
                          '',
                          [
                            {
                              text: 'Approuver',
                              onPress: () => {
                                // groupVerificationDelete(group._id).then(() => navigation.goBack()),
                              },
                            },
                            { text: 'Annuler' },
                          ],
                          { cancelable: true },
                        )
                      }
                    >
                      Supprrimer
                    </Button>
                    <Button
                      mode="contained"
                      loading={state.verification_approve?.loading}
                      color={colors.valid}
                      contentStyle={{
                        height: 50,
                        justifyContent: 'center',
                      }}
                      onPress={() =>
                        Alert.alert(
                          'Approuver ce groupe ?',
                          '',
                          [
                            {
                              text: 'Approuver',
                              onPress: () =>
                                groupVerificationApprove(group._id).then(() => navigation.goBack()),
                            },
                            { text: 'Annuler' },
                          ],
                          { cancelable: true },
                        )
                      }
                    >
                      Approuver
                    </Button>
                  </View>
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
          navigation={navigation}
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
          members={currentMembers}
          user={userToAdd}
          modifying={modifying}
          key={userToAdd?._id || 'none'}
          group={id}
          next={() => {
            if (!modifying) {
              setAddSnackbarVisible(true);
            }
          }}
        />

        <EditGroupDescriptionModal
          visible={isEditGroupDescriptionModalVisible}
          setVisible={setEditGroupDescriptionModalVisible}
          group={group}
          editingGroup={editingGroup}
          setEditingGroup={setEditingGroup}
        />

        <ChangeGroupLocationModal
          visible={isChangeGroupLocationModalVisible}
          setVisible={setChangeGroupLocationModalVisible}
          group={group}
          navigation={navigation}
        />
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { groups, account, articles, events } = state;
  return {
    groups,
    account,
    articles: articles.search,
    events: events.search,
    articlesState: articles.state,
    eventsState: events.state,
    state: groups.state,
    accountState: account.state,
  };
};

export default connect(mapStateToProps)(GroupDisplay);
