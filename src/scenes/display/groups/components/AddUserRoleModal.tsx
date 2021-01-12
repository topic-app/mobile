import React from 'react';
import { View, Platform, SectionList, TextInput as NativeTextInput } from 'react-native';
import {
  Divider,
  Button,
  Text,
  RadioButton,
  List,
  IconButton,
  HelperText,
  Title,
  Checkbox,
  TextInput,
  ProgressBar,
} from 'react-native-paper';
import { connect } from 'react-redux';

import {
  CollapsibleView,
  CategoryTitle,
  ErrorMessage,
  Modal,
  FullscreenIllustration,
} from '@components/index';
import { fetchGroup } from '@redux/actions/api/groups';
import { groupMemberAdd, groupMemberModify } from '@redux/actions/apiActions/groups';
import getStyles from '@styles/Styles';
import {
  ModalProps,
  State,
  GroupRole,
  UserPreload,
  GroupRequestState,
  User,
  GroupMember,
  AccountState,
} from '@ts/types';
import { Errors, useTheme } from '@utils/index';

type AddUserRoleModalProps = ModalProps & {
  roles: GroupRole[];
  members: GroupMember[];
  user: UserPreload | User | null;
  state: GroupRequestState;
  group: string;
  next: () => any;
  modifying?: boolean;
  account: AccountState;
};

const AddUserRoleModal: React.FC<AddUserRoleModalProps> = ({
  visible,
  setVisible,
  roles,
  members,
  user,
  group,
  state,
  next,
  modifying = false,
  account,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [primaryRole, setPrimaryRole] = React.useState<string | null>(
    modifying ? members.find((m) => m.user._id === user?._id)?.role || null : null,
  );
  const [secondaryRoles, setSecondaryRoles] = React.useState<string[]>(
    modifying ? members.find((m) => m.user._id === user?._id)?.secondaryRoles || [] : [],
  );
  const [expiryDate, setExpiryDate] = React.useState<number>(0);
  const [errorVisible, setErrorVisible] = React.useState(false);

  const sections = [
    {
      key: 'primary',
      title: 'Rôle principal',
      data: roles.filter((r) => r.primary),
    },
    {
      key: 'secondary',
      title: 'Rôles secondaires',
      data: roles.filter((r) => !r.primary),
    },
  ];

  const add = () => {
    if (!primaryRole) {
      setErrorVisible(true);
    } else {
      if (!user) return;
      if (modifying) {
        groupMemberModify(group, user._id, primaryRole, secondaryRoles)
          .then(() => {
            setVisible(false);
            fetchGroup(group);
            next();
          })
          .catch((error) =>
            Errors.showPopup({
              type: 'axios',
              what: 'la modification du membre',
              error,
              retry: add,
            }),
          );
      } else {
        const date = new Date();
        const expiry = new Date(date.setMonth(date.getMonth() + expiryDate));
        groupMemberAdd(
          group,
          user._id,
          primaryRole,
          secondaryRoles,
          expiryDate ? expiry : undefined,
        )
          .then(() => {
            setVisible(false);
            fetchGroup(group);
            next();
          })
          .catch((error) =>
            Errors.showPopup({
              type: 'axios',
              what: "l'ajout du membre",
              error,
              retry: add,
            }),
          );
      }
    }
  };

  if (!account.loggedIn) {
    return null;
  }

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <SectionList
        sections={sections}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.contentContainer}>
              <View style={styles.centerIllustrationContainer}>
                <Title>
                  {modifying ? 'Modifier' : 'Ajouter'} @{user?.info?.username || user?.displayName}
                </Title>
              </View>
            </View>
            {(modifying ? state.member_modify?.loading : state.member_add?.loading) && (
              <ProgressBar indeterminate style={{ marginTop: -4 }} />
            )}
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View>
            <Divider />
            <View style={styles.container}>
              <CategoryTitle>{title}</CategoryTitle>
            </View>
          </View>
        )}
        renderItem={({ item, section: { key } }) => {
          const set = () => {
            if (key === 'primary' && (account.accountInfo.accountId !== user?._id || !modifying)) {
              setErrorVisible(false);
              setPrimaryRole(item._id);
            } else if (secondaryRoles.includes(item._id)) {
              setSecondaryRoles(secondaryRoles.filter((i) => i !== item._id));
            } else {
              setSecondaryRoles([...secondaryRoles, item._id]);
            }
          };
          return (
            <View>
              <List.Item
                title={item.name}
                description={
                  item.legalAdmin
                    ? `Rôle${item.admin ? ' administrateur' : ''} légalement responsable`
                    : null
                }
                onPress={set}
                disabled={
                  key === 'primary' && account.accountInfo.accountId === user?._id && modifying
                }
                left={() =>
                  Platform.OS !== 'ios' &&
                  (key === 'primary' ? (
                    <RadioButton
                      value=""
                      disabled={account.accountInfo.accountId === user?._id && modifying}
                      color={colors.primary}
                      status={item._id === primaryRole ? 'checked' : 'unchecked'}
                      onPress={set}
                    />
                  ) : (
                    <Checkbox
                      color={colors.primary}
                      status={secondaryRoles.includes(item._id) ? 'checked' : 'unchecked'}
                      onPress={set}
                    />
                  ))
                }
                right={() =>
                  Platform.OS === 'ios' &&
                  (key === 'primary' ? (
                    <RadioButton
                      value=""
                      color={colors.primary}
                      disabled={account.accountInfo.accountId === user?._id && modifying}
                      status={item._id === primaryRole ? 'checked' : 'unchecked'}
                      onPress={set}
                    />
                  ) : (
                    <Checkbox
                      color={colors.primary}
                      status={secondaryRoles.includes(item._id) ? 'checked' : 'unchecked'}
                      onPress={set}
                    />
                  ))
                }
              />
            </View>
          );
        }}
        renderSectionFooter={({ section: { key } }) => (
          <View>
            <List.Item
              title="Créer un rôle"
              titleStyle={{ color: colors.disabled }}
              descriptionStyle={{ color: colors.disabled }}
              description="Non disponible"
              left={() =>
                Platform.OS !== 'ios' && (
                  <IconButton
                    style={{ width: 24, height: 24 }}
                    color={colors.disabled}
                    icon="plus"
                  />
                )
              }
            />
            {key === 'primary' && (
              <HelperText visible={errorVisible} type="error">
                Vous devez spécifier un rôle principal
              </HelperText>
            )}
          </View>
        )}
        ListFooterComponent={() => {
          const setExpiry = () => {
            if (expiryDate) {
              setExpiryDate(0);
            } else {
              setExpiryDate(12);
            }
          };
          return (
            <View>
              <Divider />
              {!modifying && (
                <View>
                  <List.Item
                    title="Expire"
                    description="Retirer l'utilisateur du groupe au bout d'un certain temps"
                    onPress={setExpiry}
                    left={() =>
                      Platform.OS !== 'ios' && (
                        <Checkbox
                          color={colors.primary}
                          status={expiryDate ? 'checked' : 'unchecked'}
                          onPress={setExpiry}
                        />
                      )
                    }
                    right={() =>
                      Platform.OS === 'ios' && (
                        <Checkbox
                          color={colors.primary}
                          status={expiryDate ? 'checked' : 'unchecked'}
                          onPress={setExpiry}
                        />
                      )
                    }
                  />
                  <CollapsibleView collapsed={!expiryDate}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <IconButton
                        icon="minus"
                        onPress={() => expiryDate && setExpiryDate(expiryDate - 1)}
                      />
                      <TextInput
                        mode="outlined"
                        style={{ minWidth: 80 }}
                        dense
                        render={(props) => (
                          <View
                            style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}
                          >
                            <NativeTextInput
                              {...props}
                              value={expiryDate.toString()}
                              autoCorrect={false}
                              onChangeText={(text) => setExpiryDate(parseInt(text, 10) || 0)}
                              keyboardType="number-pad"
                            />
                            <Text style={{ color: colors.disabled }}>mois</Text>
                          </View>
                        )}
                      />
                      <IconButton
                        icon="plus"
                        onPress={() => expiryDate && setExpiryDate(expiryDate + 1)}
                      />
                    </View>
                  </CollapsibleView>
                </View>
              )}
              <Divider />
              <View style={styles.contentContainer}>
                <Button
                  mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                  color={colors.primary}
                  uppercase={Platform.OS !== 'ios'}
                  onPress={add}
                  style={{ flex: 1 }}
                  loading={modifying ? state.member_modify?.loading : state.member_add?.loading}
                >
                  {modifying ? 'Modifier' : 'Ajouter'}
                </Button>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item._id}
      />
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { groups, account } = state;
  return { state: groups.state, account };
};

export default connect(mapStateToProps)(AddUserRoleModal);
