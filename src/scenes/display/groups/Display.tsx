import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View, Platform, ActivityIndicator, StatusBar } from 'react-native';
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
  TextInput,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  Banner,
  ContentTabView,
} from '@components';
import { fetchGroup, fetchGroupVerification } from '@redux/actions/api/groups';
import {
  groupFollow,
  groupUnfollow,
  groupReport,
  groupMemberDelete,
  groupMemberLeave,
  groupVerificationApprove,
  groupVerificationDelete,
  groupDeverify,
} from '@redux/actions/apiActions/groups';
import { fetchAccount, fetchGroups } from '@redux/actions/data/account';
import updatePrefs from '@redux/actions/data/prefs';
import getStyles from '@styles/global';
import {
  GroupPreload,
  Group,
  Account,
  GroupRequestState,
  GroupsState,
  State,
  User,
  GroupMember,
  GroupRole,
  UserPreload,
  GroupVerification,
  Avatar as AvatarType,
  PreferencesState,
} from '@ts/types';
import {
  logger,
  Format,
  checkPermission,
  Alert,
  Errors,
  shareContent,
  trackEvent,
  Permissions,
} from '@utils';

import type { GroupDisplayStackParams, GroupDisplayScreenNavigationProp } from '.';
import AddUserRoleModal from './components/AddUserRoleModal';
import AddUserSelectModal from './components/AddUserSelectModal';
import EditGroupDescriptionModal from './components/EditGroupDescriptionModal';
import EditGroupLegalModal from './components/EditGroupLegalModal';

// import ChangeGroupLocationModal from '../components/ChangeGroupLocationModal';

type GroupDisplayProps = {
  navigation: GroupDisplayScreenNavigationProp<'Display'>;
  route: RouteProp<GroupDisplayStackParams, 'Display'>;
  groups: GroupsState;
  account: Account;
  state: GroupRequestState;
  preferences: PreferencesState;
};

const GroupDisplay: React.FC<GroupDisplayProps> = ({
  route,
  navigation,
  groups,
  account,
  state,
  preferences,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  // Pour changer le type de route.params, voir ../index.tsx
  const { id, verification } = route.params;

  const fetch = verification ? () => fetchGroupVerification(id) : () => fetchGroup(id);

  React.useEffect(() => {
    fetch();
  }, [id]);

  const group: Group | GroupPreload | GroupVerification | null =
    groups.item?._id === id
      ? groups.item
      : groups.data.find((g) => g._id === id) || groups.search.find((g) => g._id === id) || null;

  const following =
    account.loggedIn && account.accountInfo.user.data.following.groups.some((g) => g._id === id);

  const toggleFollow = () => {
    if (following) {
      groupUnfollow(id)
        .then(fetchAccount)
        .catch((error) =>
          Errors.showPopup({
            type: 'axios',
            what: 'la modification du suivi du groupe',
            error,
            retry: toggleFollow,
          }),
        );
    } else {
      groupFollow(id)
        .then(fetchAccount)
        .catch((error) =>
          Errors.showPopup({
            type: 'axios',
            what: 'la modification du suivi du groupe',
            error,
            retry: toggleFollow,
          }),
        );
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
            groupMemberLeave(id)
              .then(() => {
                fetch();
                fetchGroups();
              })
              .catch((error) =>
                Errors.showPopup({
                  type: 'axios',
                  what: 'la proc??dure pour quitter le groupe',
                  error,
                  retry: leave,
                }),
              ),
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
  const [memberListExpanded, setMemberListExpanded] = React.useState(false);

  const [isAddSnackbarVisible, setAddSnackbarVisible] = React.useState(false);

  const [verificationMessage, setVerificationMessage] = React.useState('');

  const [legalCollapsed, setLegalCollapsed] = React.useState(true);

  const [isEditGroupDescriptionModalVisible, setEditGroupDescriptionModalVisible] = React.useState(
    false,
  );
  const [isEditGroupLegalModalVisible, setEditGroupLegalModalVisible] = React.useState(false);
  const [descriptionVisible, setDescriptionVisible] = React.useState(verification || false);

  const deverifyGroup = () =>
    groupDeverify(id)
      .then(() => {
        navigation.goBack();
        Alert.alert(
          'Groupe remis en mod??ration',
          "Vous pouvez le voir dans l'onglet mod??ration",
          [{ text: 'Fermer' }],
          {
            cancelable: true,
          },
        );
      })
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: 'la d??v??rification du groupe',
          error,
          retry: deverifyGroup,
        }),
      );

  if (!group) {
    // This is when article has not been loaded in list, so we have absolutely no info
    return (
      <View style={styles.page}>
        <SafeAreaView style={{ flex: 1 }}>
          <PlatformBackButton onPress={navigation.goBack} />

          {state.info.error && (
            <ErrorMessage
              type="axios"
              strings={{
                what: 'la r??cup??ration de ce groupe',
                contentSingular: 'Le groupe',
              }}
              error={state.info.error}
              retry={fetch}
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

  navigation.setOptions({ title: group.name });

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        {state.info.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la r??cup??ration de ce groupe',
              contentSingular: 'Le groupe',
            }}
            error={state.info.error}
            retry={fetch}
          />
        )}
        <ScrollView>
          <View style={styles.centeredPage}>
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
                      accessibilityLabel="Modifier le groupe"
                      onPress={() => {
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
                      accessibilityLabel="Options suppl??mentaires"
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
                      trackEvent('groupdisplay:share', { props: { button: 'header' } });
                      shareContent({
                        title: `Groupe ${group.displayName}`,
                        type: 'groupes',
                        id: group._id,
                      });
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
                  <Menu.Item
                    key="block"
                    title={preferences.blocked.includes(group._id) ? 'D??bloquer' : 'Bloquer'}
                    onPress={() => {
                      if (preferences.blocked.includes(group._id)) {
                        updatePrefs({
                          blocked: preferences.blocked.filter((g) => g !== group._id),
                        });
                      } else {
                        Alert.alert(
                          'Bloquer ce groupe ?',
                          'Vous ne verrez plus de contenus ??crits par ce groupe',
                          [
                            { text: 'Annuler' },
                            {
                              text: 'Bloquer',
                              onPress: () =>
                                updatePrefs({
                                  blocked: [...preferences.blocked, group._id],
                                }),
                            },
                          ],
                          { cancelable: true },
                        );
                      }
                    }}
                  />
                  {checkPermission(account, {
                    permission: Permissions.GROUP_VERIFICATION_DEVERIFY,
                    scope: { everywhere: true },
                  }) && group?.type !== 'administrateur' ? (
                    <Menu.Item
                      key="deverify"
                      title="D??v??rifier"
                      onPress={() => {
                        setMenuVisible(false);
                        Alert.alert(
                          'Remettre ce groupe en mod??ration ?',
                          'Les administrateurs du groupe seront notifi??s et les membres ne pourront plus publier de contenus.',
                          [
                            { text: 'Annuler' },
                            {
                              text: 'D??v??rifier',
                              onPress: () => {
                                deverifyGroup();
                                trackEvent('groupdisplay:deverify', {
                                  props: { button: 'header' },
                                });
                              },
                            },
                          ],
                          { cancelable: true },
                        );
                      }}
                    />
                  ) : null}
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
                          navigation.push('Root', {
                            screen: 'Main',
                            params: {
                              screen: 'Display',
                              params: {
                                screen: 'Image',
                                params: {
                                  screen: 'Display',
                                  params: { image: group.avatar?.image?.image },
                                },
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
                    <Title style={{ textAlign: 'center' }}>{group.name}</Title>
                    <View style={{ marginLeft: 5 }}>
                      {group.official && (
                        <Icon name="check-decagram" color={colors.primary} size={20} />
                      )}
                    </View>
                  </View>
                  {!!group.shortName && (
                    <Subheading
                      style={{ textAlign: 'center', marginTop: -10, color: colors.disabled }}
                    >
                      {group.shortName}
                    </Subheading>
                  )}
                  <Subheading
                    style={{ textAlign: 'center', marginTop: -10, color: colors.disabled }}
                  >
                    Groupe {group.type}
                  </Subheading>
                  {preferences.blocked.includes(group._id) ? (
                    <Subheading style={{ textAlign: 'center', color: colors.invalid }}>
                      Groupe bloqu??
                    </Subheading>
                  ) : null}
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
                        <Text style={{ fontSize: 40 }}>
                          {typeof group.cache?.followers === 'number' ? group.cache.followers : ''}
                        </Text>
                        <Text>Abonn??s</Text>
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 40 }}>{group.members?.length}</Text>
                        <Text>Membres</Text>
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
                            loading={state.follow?.loading || account.state.fetchAccount.loading}
                            mode={following ? 'outlined' : 'contained'}
                            uppercase={Platform.OS !== 'ios'}
                            style={{
                              backgroundColor: following ? colors.surface : colors.primary,
                              borderRadius: 20,
                            }}
                            onPress={toggleFollow}
                          >
                            {following ? 'Abonn??' : "S'abonner"}
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
                        <Paragraph style={{ color: colors.disabled }}>
                          Groupe {group.type}
                        </Paragraph>
                        <Content parser="plaintext" data={group.summary || ''} />
                      </View>
                    </View>
                    {group.description?.data ? (
                      <View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ color: colors.disabled, alignSelf: 'center' }}>
                            Voir la description compl??te
                          </Text>
                          <Icon
                            name={descriptionVisible ? 'chevron-down' : 'chevron-right'}
                            color={colors.disabled}
                            size={23}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                </PlatformTouchable>
                <CollapsibleView collapsed={!descriptionVisible}>
                  <View style={styles.container}>
                    <Content parser={group.description?.parser} data={group.description?.data} />
                  </View>
                </CollapsibleView>
                <Divider />
                {group.parent && (
                  <View>
                    <InlineCard
                      key={group.parent._id}
                      avatar={group.parent.avatar}
                      title={`Affili?? ?? ${group.parent.displayName || group.parent.name}`}
                      subtitle={`Groupe ${group.parent.type}`}
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
                                  id: group.parent?._id,
                                  title: group.parent?.displayName,
                                },
                              },
                            },
                          },
                        })
                      }
                    />
                    <Divider />
                  </View>
                )}
                {group.location.global && <InlineCard icon="map-marker" title="France Enti??re" />}
                {group.location.schools?.map((school) => (
                  <InlineCard
                    key={school._id}
                    icon="school"
                    title={school.name}
                    subtitle={
                      school?.address ? Format.shortAddress(school.address) : school?.shortName
                    }
                  />
                ))}
                {group.location.departments?.map((dep) => (
                  <InlineCard
                    key={dep._id}
                    icon="domain"
                    title={dep.displayName}
                    subtitle={
                      dep.type === 'departement'
                        ? 'D??partement'
                        : dep.type === 'region'
                        ? 'R??gion'
                        : 'Zone'
                    }
                  />
                ))}
                <Divider />
                {/* checkPermission(account, {
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
                ) */}
                {!!group.cache?.subgroups?.length && (
                  <View>
                    <View style={styles.container}>
                      <CategoryTitle>Groupes membres</CategoryTitle>
                    </View>
                    {group.cache.subgroups.map((g) => (
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
                    <Divider />
                  </View>
                )}
                <View style={styles.container}>
                  <CategoryTitle>Membres</CategoryTitle>
                </View>
                <Banner visible={isAddSnackbarVisible} actions={[]}>
                  Une invitation a ??t?? envoy??e ?? @{userToAdd?.info?.username || ''}
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
                            }${
                              group.members?.find(
                                (m) => m.user?._id === account.accountInfo?.accountId,
                              )?.description
                                ? ` - ${
                                    group.members?.find(
                                      (m) => m.user?._id === account.accountInfo?.accountId,
                                    )?.description
                                  }`
                                : ''
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
                                : undefined
                            }
                            badgeColor={colors.primary}
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
                              accessibilityLabel="Modifier mon role"
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
                  ?.filter(
                    (m) =>
                      m.user?._id !== account.accountInfo?.accountId &&
                      (memberListExpanded || group.roles?.find((r) => r._id === m.role)?.admin),
                  )
                  .sort((a, b) => {
                    const hierarchyA =
                      group.roles?.find((r) => r._id === a.role)?.hierarchy ?? Infinity;
                    const hierarchyB =
                      group.roles?.find((r) => r._id === b.role)?.hierarchy ?? Infinity;
                    return hierarchyA > hierarchyB ? 1 : hierarchyB > hierarchyA ? -1 : 0;
                  })
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
                          title={
                            mem.user?.data?.public
                              ? mem.user?.displayName
                              : `@${mem.user?.info?.username}`
                          }
                          subtitle={`${
                            mem.user?.data?.public ? `@${mem.user?.info?.username} - ` : ''
                          }${group.roles?.find((r) => mem.role === r._id)?.name}${
                            mem.description ? ` - ${mem.description}` : ''
                          }`}
                          subtitleNumberOfLines={2}
                          badge={
                            group.roles?.find((r) => r._id === mem.role)?.admin ? 'star' : undefined
                          }
                          badgeColor={colors.primary}
                          avatar={mem.user?.info?.avatar}
                          onPress={() =>
                            navigation.push('Root', {
                              screen: 'Main',
                              params: {
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
                            accessibilityLabel="Modifier le membre"
                            onPress={() => {
                              setCurrentMembers(group.members || []);
                              setCurrentRoles(group.roles || []);
                              setUserToAdd(mem.user);
                              setModifying(true);
                              setAddSnackbarVisible(false);
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
                            accessibilityLabel="Retirer le membre"
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
                                      setUserToAdd(mem.user);
                                      setAddSnackbarVisible(false);
                                      groupMemberDelete(id, mem.user?._id)
                                        .then(fetch)
                                        .catch((error) =>
                                          Errors.showPopup({
                                            type: 'axios',
                                            what: 'la suppression du membre',
                                            error,
                                          }),
                                        );
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
                {group.members?.filter((m) => group.roles?.find((r) => r._id === m.role)?.admin)
                  ?.length !== group.members?.length && (
                  <View style={styles.container}>
                    <Button
                      mode="text"
                      uppercase={false}
                      color={colors.subtext}
                      onPress={() => {
                        setMemberListExpanded(!memberListExpanded);
                      }}
                      icon={memberListExpanded ? 'chevron-up' : 'chevron-down'}
                    >
                      {memberListExpanded ? 'Voir moins' : 'Voir tous les membres'}
                    </Button>
                  </View>
                )}
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
                    <Button
                      mode="text"
                      uppercase={false}
                      color={colors.subtext}
                      onPress={() => {
                        setLegalCollapsed(!legalCollapsed);
                      }}
                      icon={legalCollapsed ? 'chevron-down' : 'chevron-up'}
                    >
                      Informations l??gales
                    </Button>
                  </View>
                  <CollapsibleView collapsed={legalCollapsed && !verification}>
                    <View style={styles.contentContainer}>
                      <Divider style={{ marginBottom: 20 }} />
                      <Subheading>Nom complet</Subheading>
                      <Text>{group.legal?.name || 'Non sp??cifi??'}</Text>
                      <Divider style={{ marginVertical: 20 }} />
                      <Subheading>Identifiant</Subheading>
                      <Text>{group.legal?.id || 'Non sp??cifi??'}</Text>
                      <Divider style={{ marginVertical: 20 }} />
                      <Subheading>Responsable l??gal</Subheading>
                      <Text>{group.legal?.admin}</Text>
                      <Divider style={{ marginVertical: 20 }} />
                      <Subheading>Si??ge social</Subheading>
                      <Text>{group.legal?.address || 'Non sp??cifi??'}</Text>
                      <Divider style={{ marginVertical: 20 }} />
                      <Subheading>Adresse email</Subheading>
                      <Text>{group.legal?.email}</Text>
                      <Divider style={{ marginVertical: 20 }} />
                      {group.legal?.extra ? (
                        <View>
                          <Subheading>Donn??es suppl??mentaires</Subheading>
                          <Text>{group.legal?.extra}</Text>
                          <Divider style={{ marginVertical: 20 }} />
                        </View>
                      ) : null}
                    </View>
                    {checkPermission(account, {
                      permission: Permissions.GROUP_MODIFY,
                      scope: { groups: [id] },
                    }) ? (
                      <View style={styles.container}>
                        <Button mode="outlined" onPress={() => setEditGroupLegalModalVisible(true)}>
                          Modifier
                        </Button>
                      </View>
                    ) : null}
                  </CollapsibleView>
                </View>
                <View style={{ height: 20 }} />
                {!verification && <ContentTabView searchParams={{ groups: [id] }} />}
                {verification && (
                  <View>
                    <Divider style={{ marginTop: 30 }} />
                    <View style={styles.contentContainer}>
                      <Subheading>Donn??es de v??rification suppl??mentaires</Subheading>
                      <Text>
                        {(group as GroupVerification).verification?.data?.extra || 'Non sp??cifi??'}
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
                    <View style={styles.container}>
                      <TextInput
                        mode="outlined"
                        label="Informations ?? envoyer ?? l'administrateur"
                        value={verificationMessage}
                        onChangeText={setVerificationMessage}
                      />
                    </View>
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
                                text: 'Supprimer',
                                onPress: () => {
                                  groupVerificationDelete(group._id, verificationMessage).then(() =>
                                    navigation.goBack(),
                                  );
                                },
                              },
                              { text: 'Annuler' },
                            ],
                            { cancelable: true },
                          )
                        }
                      >
                        Supprimer
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
                              { text: 'Annuler' },
                              {
                                text: 'Approuver',
                                onPress: () =>
                                  groupVerificationApprove(group._id).then(() =>
                                    navigation.goBack(),
                                  ),
                              },
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
          </View>
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
          editingGroup={
            group.preload
              ? null
              : {
                  id: group._id,
                  name: group.name,
                  shortName: group.shortName,
                  summary: group.summary,
                  description: group.description?.data,
                  avatar: group.avatar,
                }
          }
        />

        <EditGroupLegalModal
          visible={isEditGroupLegalModalVisible}
          setVisible={setEditGroupLegalModalVisible}
          group={group}
          editingGroup={
            group.preload
              ? null
              : {
                  id: group._id,
                  name: group.name,
                  legal: group.legal,
                }
          }
        />

        {/* <ChangeGroupLocationModal
          visible={isChangeGroupLocationModalVisible}
          setVisible={setChangeGroupLocationModalVisible}
          group={group}
          navigation={navigation}
        /> */}
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { groups, account, preferences } = state;
  return {
    groups,
    account,
    state: groups.state,
    preferences,
  };
};

export default connect(mapStateToProps)(GroupDisplay);
