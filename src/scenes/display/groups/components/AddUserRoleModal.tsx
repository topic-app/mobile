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

import { ModalProps, State, GroupRole, UserPreload, GroupRequestState } from '@ts/types';
import { CollapsibleView, CategoryTitle, ErrorMessage, Modal } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';
import { groupMemberAdd } from '@redux/actions/apiActions/groups';
import { fetchGroup } from '@redux/actions/api/groups';

type AddUserRoleModalProps = ModalProps & {
  roles: GroupRole[];
  user: UserPreload;
  state: GroupRequestState;
  group: string;
  next: () => any;
};

const AddUserRoleModal: React.FC<AddUserRoleModalProps> = ({
  visible,
  setVisible,
  roles,
  user,
  group,
  state,
  next,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [primaryRole, setPrimaryRole] = React.useState(null);
  const [secondaryRoles, setSecondaryRoles] = React.useState([]);
  const [expiryDate, setExpiryDate] = React.useState(0);
  const [errorVisible, setErrorVisible] = React.useState(false);

  console.log(roles);

  let sections = [
    {
      key: 'primary',
      title: 'Role principal',
      data: roles.filter((r) => r.primary),
    },
    {
      key: 'secondary',
      title: 'Roles secondaires',
      data: roles.filter((r) => !r.primary),
    },
  ];

  let add = () => {
    if (!primaryRole) {
      setErrorVisible(true);
    } else {
      let date = new Date();
      let expiry = new Date(date.setMonth(date.getMonth() + expiryDate));
      groupMemberAdd(
        group,
        user._id,
        primaryRole,
        secondaryRoles,
        expiryDate ? expiry : undefined,
      ).then(() => {
        setVisible(false);
        fetchGroup(group);
        next();
      });
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <SectionList
        sections={sections}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.contentContainer}>
              <View style={styles.centerIllustrationContainer}>
                <Title>Ajouter @{user?.info?.username || user?.displayName}</Title>
              </View>
            </View>
            {state.member_add?.loading && <ProgressBar indeterminate style={{ marginTop: -4 }} />}
            {state.member_add?.error ? (
              <ErrorMessage
                type="axios"
                strings={{
                  what: "l'ajout de l'utilisateur",
                  contentSingular: "L'utilisateur",
                }}
                error={state.member_add?.error}
                retry={() => add()}
              />
            ) : null}
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
          let set = () => {
            if (key === 'primary') {
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
                    ? `Role${item.admin ? ' administrateur' : ''} légalement responsable`
                    : null
                }
                onPress={set}
                left={() =>
                  Platform.OS !== 'ios' &&
                  (key === 'primary' ? (
                    <RadioButton
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
              />
            </View>
          );
        }}
        renderSectionFooter={({ section: { key } }) => (
          <View>
            <List.Item
              title="Créer un role"
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
                Vous devez spécifier un role principal
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
                          textAlign="center"
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
              <Divider />
              <View style={styles.contentContainer}>
                <Button
                  mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                  color={colors.primary}
                  uppercase={Platform.OS !== 'ios'}
                  onPress={add}
                  style={{ flex: 1 }}
                >
                  Ajouter
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
  const { groups } = state;
  return { state: groups.state };
};

export default connect(mapStateToProps)(AddUserRoleModal);
