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
} from '@ts/types';
import {
  Divider,
  ProgressBar,
  Button,
  HelperText,
  TextInput as PaperTextInput,
  Card,
  Searchbar,
  Text,
  List,
  useTheme,
} from 'react-native-paper';
import { View, Platform, FlatList } from 'react-native';
import Illustration from '@components/Illustration';
import Avatar from '@components/Avatar';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { searchTags, updateTags } from '@redux/actions/api/tags';
import { searchGroups, updateGroups } from '@redux/actions/api/groups';
import { searchUsers, updateUsers } from '@redux/actions/api/users';

import { CollapsibleView, ErrorMessage } from '@components/index';
import getStyles from '@styles/Styles';
import { addArticleQuick } from '@redux/actions/contentData/articles';
import getArticleStyles from '../styles/Styles';

type QuickSelectModalProps = ModalProps & {
  quicks: ArticleQuickItem[];
  editingList: ArticleListItem | null;
  setEditingList: (props: ArticleListItem | null) => void;
  type: 'tag' | 'group' | 'user';
  tags: TagsState;
  groups: GroupsState;
  users: UsersState;
};

function QuickSelectModal({
  visible,
  setVisible,
  type,
  tags,
  groups,
  users,
  quicks,
}: QuickSelectModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [searchText, setSearchText] = React.useState('');

  let data: Tag[] | User[] | Group[] = [];
  let update: (text?: string) => void = () => {};
  let icon = 'alert-decagram';
  let state: { list: RequestState; search: RequestState } = {
    list: { loading: { initial: false }, error: true },
    search: { loading: { initial: false }, error: true },
  };
  switch (type) {
    case 'tag':
      data = searchText ? tags.search : tags.data;
      update = (text = searchText) =>
        text ? searchTags('initial', text, {}) : updateTags('initial');
      icon = 'pound';
      state = tags.state;
      break;
    case 'user':
      data = searchText ? users.search : users.data;
      update = (text = searchText) =>
        text ? searchUsers('initial', text, {}) : updateUsers('initial');
      icon = 'account';
      state = users.state;
      break;
    case 'group':
      data = searchText ? groups.search : groups.data;
      update = (text = searchText) =>
        text ? searchGroups('initial', text, {}) : updateGroups('initial');
      icon = 'account-multiple';
      state = groups.state;
      break;
  }

  React.useEffect(() => {
    update();
  }, [null]);

  return (
    <Modal
      isVisible={visible}
      avoidKeyboard
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      onSwipeComplete={() => setVisible(false)}
      swipeDirection={['down']}
      style={styles.bottomModal}
    >
      <Card>
        <View>
          <View style={{ height: 200 }}>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name={type} height={200} width={200} />
            </View>
          </View>
          <Divider />
          {state.list.loading.initial ||
            (state.search.loading.initial && (
              <ProgressBar indeterminate style={{ marginTop: -4 }} />
            ))}
          {(searchText === '' && state.list.error) || (searchText !== '' && state.search.error) ? (
            <ErrorMessage
              type="axios"
              strings={{
                what: 'la récupération des données',
                contentPlural: 'des données',
                contentSingular: 'La liste de données',
              }}
              error={[state.list.error, state.search.error]}
              retry={update}
            />
          ) : null}

          <View style={styles.container}>
            <Searchbar
              autoFocus
              placeholder="Rechercher"
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                update(text);
              }}
            />
          </View>
          <FlatList
            data={data}
            keyExtractor={(i) => i._id}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={() => (
              <View style={{ minHeight: 50 }}>
                {(searchText === '' && state.list.success) ||
                  (searchText !== '' && state.search.success && (
                    <View style={styles.centerIllustrationContainer}>
                      <Text>Aucun résultat</Text>
                    </View>
                  ))}
              </View>
            )}
            renderItem={({ item }) =>
              quicks.some((q) => q.id === item._id) ? null : (
                <List.Item
                  title={item.name || item.info?.username}
                  left={() =>
                    item.avatar || item.info?.avatar ? (
                      <Avatar avatar={item.avatar || item.info?.avatar} size={50} />
                    ) : (
                      <List.Icon icon={icon} color={item.color} />
                    )
                  }
                  onPress={() => {
                    addArticleQuick(type, item._id, item.name || item.info?.username);
                    setVisible(false);
                  }}
                />
              )
            }
          />
        </View>
      </Card>
    </Modal>
  );
}

const mapStateToProps = (state: State) => {
  const { articleData, tags, groups, users } = state;
  return {
    quicks: articleData.quicks,
    tags,
    groups,
    users,
  };
};

export default connect(mapStateToProps)(QuickSelectModal);
