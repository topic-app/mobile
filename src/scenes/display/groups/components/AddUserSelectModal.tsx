import React from 'react';
import {
  ModalProps,
  State,
  ArticleQuickItem,
  TagsState,
  GroupsState,
  UsersState,
  Tag,
  Group,
  User,
  RequestState,
  UserRequestState,
  GroupMember,
  Account,
} from '@ts/types';
import {
  Divider,
  ProgressBar,
  Button,
  HelperText,
  TextInput as PaperTextInput,
  Card,
  Text,
  List,
  ThemeProvider,
  useTheme,
} from 'react-native-paper';
import { View, Platform, FlatList } from 'react-native';
import Illustration from '@components/Illustration';
import Avatar from '@components/Avatar';
import { connect } from 'react-redux';
import { searchTags, updateTags } from '@redux/actions/api/tags';
import { searchGroups, updateGroups } from '@redux/actions/api/groups';
import { searchUsers, updateUsers } from '@redux/actions/api/users';

import { CollapsibleView, ErrorMessage, Searchbar, Modal } from '@components/index';
import getStyles from '@styles/Styles';
import { addArticleQuick } from '@redux/actions/contentData/articles';
import getGroupStyles from '../styles/Styles';

type AddUserSelectModalProps = ModalProps & {
  users: UsersState;
  state: UserRequestState;
  members: GroupMember[];
  account: Account;
  next: (user: User) => any;
};

function AddUserSelectModal({
  visible,
  setVisible,
  users,
  state,
  members,
  account,
  next,
}: AddUserSelectModalProps) {
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
}

const mapStateToProps = (state: State) => {
  const { users, account } = state;
  return {
    users,
    state: users.state,
    account,
  };
};

export default connect(mapStateToProps)(AddUserSelectModal);
