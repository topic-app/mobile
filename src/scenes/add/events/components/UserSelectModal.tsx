import React from 'react';
import { View, FlatList } from 'react-native';
import { Divider, ProgressBar, Text, List, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Modal, ErrorMessage, Searchbar, Avatar, Illustration } from '@components';
import { searchUsers } from '@redux/actions/api/users';
import getStyles from '@styles/global';
import { ModalProps, State, UsersState, UserRequestState, Account, UserPreload } from '@ts/types';

type UserSelectModalProps = ModalProps & {
  users: UsersState;
  state: UserRequestState;
  account: Account;
  next: (user: UserPreload) => any;
};

function UserSelectModal({
  visible,
  setVisible,
  users,
  state,
  account,
  next,
}: UserSelectModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [searchText, setSearchText] = React.useState('');

  const update = (text = searchText) => {
    if (text !== '') {
      searchUsers('initial', text);
    }
  };

  React.useEffect(() => {
    update();
  }, [null]);

  const data = searchText === '' ? account.accountInfo?.user?.data?.following?.users : users.search;

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={{ height: 200 }}>
          <View style={styles.centerIllustrationContainer}>
            <Illustration name="search" height={200} width={200} />
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
            error={state.add?.error}
            retry={update}
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
              title={`@${item.info?.username || item.displayName}`}
              left={() => <Avatar avatar={item.info?.avatar} size={50} />}
              onPress={() => {
                next(item);
                setVisible(false);
              }}
            />
          )}
        />
      </View>
    </Modal>
  );
}

const mapStateToProps = (state: State) => {
  const { users, account } = state;
  return {
    users,
    state: users.state,
    account,
  };
};

export default connect(mapStateToProps)(UserSelectModal);
