import React from 'react';
import { View, FlatList } from 'react-native';
import { Divider, ProgressBar, Text, List } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  ModalProps,
  State,
  UsersState,
  User,
  UserRequestState,
  GroupMember,
  Account,
} from '@ts/types';
import { Avatar, Illustration, ErrorMessage, Searchbar, Modal } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';
import { searchUsers } from '@redux/actions/api/users';

import getGroupStyles from '../styles/Styles';

type AddUserSelectModalProps = ModalProps & {
  users: UsersState;
  state: UserRequestState;
  members: GroupMember[];
  account: Account;
  next: (user: User) => any;
};

const AddUserSelectModal: React.FC<AddUserSelectModalProps> = ({
  visible,
  setVisible,
  users,
  state,
  members,
  account,
  next,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const groupStyles = getGroupStyles(theme);
  const { colors } = theme;

  const [searchText, setSearchText] = React.useState('');

  let update = (text = searchText) => {
    if (text !== '') {
      searchUsers('initial', text);
    }
  };

  React.useEffect(() => {
    update();
  }, [null]);

  let data = searchText === '' ? account.accountInfo?.user?.data?.following?.users : users.search;

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={{ height: 200 }}>
          <View style={styles.centerIllustrationContainer}>
            <Illustration name="user" height={200} width={200} />
          </View>
        </View>
        <Divider />
        {state.search?.loading.initial && <ProgressBar indeterminate style={{ marginTop: -4 }} />}
        {searchText !== '' && state.search?.error ? (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération des utilisateurs',
              contentPlural: 'des utilisateurs',
              contentSingular: "La liste d'utilisateurs",
            }}
            error={state.search?.error}
            retry={() => update()}
          />
        ) : null}

        <View style={styles.container}>
          <Searchbar
            autoFocus
            placeholder="Rechercher"
            value={searchText}
            onChangeText={setSearchText}
            onIdle={update}
          />
        </View>
        <FlatList
          data={data}
          keyExtractor={(i) => i._id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={() => (
            <View style={{ minHeight: 50 }}>
              {(searchText === '' && state.list.success) ||
                (searchText !== '' && state.search?.success && (
                  <View style={styles.centerIllustrationContainer}>
                    <Text>Aucun résultat</Text>
                  </View>
                ))}
            </View>
          )}
          renderItem={({ item }) => (
            <List.Item
              description={
                members.some((m) => m.user?._id === item._id)
                  ? 'Utilisateur déjà dans le groupe'
                  : ''
              }
              titleStyle={
                members.some((m) => m.user?._id === item._id) ? { color: colors.disabled } : {}
              }
              descriptionStyle={
                members.some((m) => m.user?._id === item._id) ? { color: colors.disabled } : {}
              }
              title={`@${item.info?.username || item.displayName}`}
              left={() => <Avatar avatar={item.info?.avatar} size={50} />}
              onPress={
                members.some((m) => m.user?._id === item._id)
                  ? null
                  : () => {
                      next(item);
                      setVisible(false);
                    }
              }
            />
          )}
        />
      </View>
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { users, account } = state;
  return {
    users,
    state: users.state,
    account,
  };
};

export default connect(mapStateToProps)(AddUserSelectModal);
