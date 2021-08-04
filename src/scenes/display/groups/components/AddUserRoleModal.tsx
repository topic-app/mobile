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
  useTheme,
} from 'react-native-paper';
import { connect } from 'react-redux';

import { CollapsibleView, CategoryTitle, Modal } from '@components';
import { fetchGroup } from '@redux/actions/api/groups';
import { groupMemberAdd, groupMemberModify } from '@redux/actions/apiActions/groups';
import getStyles from '@styles/global';
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
import { Errors } from '@utils';

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
  const [description, setDescription] = React.useState<string>('');
  const [descriptionErrorVisible, setDescriptionErrorVisible] = React.useState(false);
  const [expiryDate, setExpiryDate] = React.useState<number>(0);
  const [roleErrorVisible, setRoleErrorVisible] = React.useState(false);

  const add = () => {
    if (!primaryRole) {
      setRoleErrorVisible(true);
    } else if (description.length > 50) {
      setDescriptionErrorVisible(true);
    } else {
      if (!user) return;
      if (modifying) {
        groupMemberModify(group, user._id, primaryRole, description)
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
        groupMemberAdd(group, user._id, primaryRole, description, expiryDate ? expiry : undefined)
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

  const setRole = (id: string) => {
    if (account.accountInfo.accountId !== user?._id || !modifying) {
      setRoleErrorVisible(false);
      setPrimaryRole(id);
    }
  };

  const setExpiry = () => {
    if (expiryDate) {
      setExpiryDate(0);
    } else {
      setExpiryDate(12);
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={styles.contentContainer}>
          <View style={styles.centerIllustrationContainer}>
            <Title>
              {modifying ? 'Modifier' : 'Ajouter'} @{user?.info?.username || user?.displayName}
            </Title>
          </View>
        </View>
        {roles.map((item) => (
          <List.Item
            title={item.name}
            description={
              item.legalAdmin
                ? `Rôle${item.admin ? ' administrateur' : ''} légalement responsable`
                : null
            }
            onPress={() => setRole(item._id)}
            disabled={account.accountInfo.accountId === user?._id && modifying}
            left={() =>
              Platform.OS !== 'ios' && (
                <RadioButton
                  value=""
                  disabled={account.accountInfo.accountId === user?._id && modifying}
                  color={colors.primary}
                  status={item._id === primaryRole ? 'checked' : 'unchecked'}
                  onPress={() => setRole(item._id)}
                />
              )
            }
            right={() =>
              Platform.OS === 'ios' && (
                <RadioButton
                  value=""
                  color={colors.primary}
                  disabled={account.accountInfo.accountId === user?._id && modifying}
                  status={item._id === primaryRole ? 'checked' : 'unchecked'}
                  onPress={() => setRole(item._id)}
                />
              )
            }
          />
        ))}
        <HelperText visible={roleErrorVisible} type="error">
          Vous devez spécifier un rôle principal
        </HelperText>
        <View>
          <Divider />
          <View style={styles.container}>
            <TextInput
              mode="outlined"
              label="Description (facultatif)"
              value={description}
              error={descriptionErrorVisible}
              onChangeText={(text) => {
                setDescription(text);
                setDescriptionErrorVisible(text.length > 50);
              }}
            />
            <CollapsibleView collapsed={!descriptionErrorVisible}>
              <HelperText visible={descriptionErrorVisible} type="error">
                La description doit faire moins de 50 caractères
              </HelperText>
            </CollapsibleView>
          </View>
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
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
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
      </View>
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { groups, account } = state;
  return { state: groups.state, account };
};

export default connect(mapStateToProps)(AddUserRoleModal);
