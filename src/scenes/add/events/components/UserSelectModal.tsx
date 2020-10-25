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
import Modal, { BottomModal, SlideAnimation } from '@components/Modals';
import { searchTags, updateTags } from '@redux/actions/api/tags';
import { searchGroups, updateGroups } from '@redux/actions/api/groups';
import { searchUsers, updateUsers } from '@redux/actions/api/users';

import { CollapsibleView, ErrorMessage, Searchbar } from '@components/index';
import getStyles from '@styles/Styles';
import { addArticleQuick } from '@redux/actions/contentData/articles';
import getEventStyles from '../styles/Styles';

type UserSelectModalProps = ModalProps & {
  users: UsersState;
  state: UserRequestState;
  account: Account;
  next: (user: User) => any;
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
  const eventStyles = getEventStyles(theme);
  const { colors } = theme;

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
    <BottomModal
      visible={visible}
      onTouchOutside={() => {
        setVisible(false);
      }}
      onHardwareBackPress={() => {
        setVisible(false);
        return true;
      }}
      onSwipeOut={() => {
        setVisible(false);
      }}
      modalAnimation={
        new SlideAnimation({
          slideFrom: 'bottom',
          useNativeDriver: false,
        })
      }
    >
      <ThemeProvider theme={theme}>
        <Card style={styles.modalCard}>
          <View>
            <View style={{ height: 200 }}>
              <View style={styles.centerIllustrationContainer}>
                <Illustration name="search" height={200} width={200} />
              </View>
            </View>
            <Divider />
            {state.search?.loading.initial && (
              <ProgressBar indeterminate style={{ marginTop: -4 }} />
            )}
            {searchText !== '' && state.search?.error ? (
              <ErrorMessage
                type="axios"
                strings={{
                  what: 'la récupération des utilisateurs',
                  contentPlural: 'des utilisateurs',
                  contentSingular: "La liste d'utilisateurs",
                }}
                error={state.add?.error}
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
                  title={`@${item.info?.username || item.displayName}`}
                  left={() => <Avatar avatar={item.info?.avatar} size={50} />}
                  onPress={() => {
                          next(item);
                          setVisible(false);
                        }
                  }
                />
              )}
            />
          </View>
        </Card>
      </ThemeProvider>
    </BottomModal>
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
