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
  DepartmentsState,
  SchoolsState,
  ArticleListItem,
  EventQuickItem,
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
import { connect } from 'react-redux';

import { Searchbar, Illustration, Avatar, ErrorMessage, Modal } from '@components/index';
import getStyles from '@styles/Styles';
import { addArticleQuick } from '@redux/actions/contentData/articles';
import { addEventQuick } from '@redux/actions/contentData/events';
import { searchTags, updateTags } from '@redux/actions/api/tags';
import { searchGroups, updateGroups } from '@redux/actions/api/groups';
import { searchUsers, updateUsers } from '@redux/actions/api/users';
import { searchSchools, updateSchools } from '@redux/actions/api/schools';
import { searchDepartments, updateDepartments } from '@redux/actions/api/departments';

import getArticleStyles from './styles/Styles';

type QuickSelectModalProps = ModalProps & {
  articleQuicks: ArticleQuickItem[];
  eventQuicks: EventQuickItem[];
  editingList: ArticleListItem | null;
  setEditingList: (props: ArticleListItem | null) => void;
  dataType: 'tag' | 'group' | 'user' | 'school' | 'region' | 'departement';
  tags: TagsState;
  groups: GroupsState;
  users: UsersState;
  departments: DepartmentsState;
  schools: SchoolsState;
  type: 'articles' | 'events';
};

function QuickSelectModal({
  visible,
  setVisible,
  type,
  tags,
  groups,
  departments,
  schools,
  users,
  articleQuicks,
  eventQuicks,
  dataType,
}: QuickSelectModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [searchText, setSearchText] = React.useState('');

  const quicks = type === 'articles' ? articleQuicks : eventQuicks;

  let data: Tag[] | User[] | Group[] = [];
  let update: (text?: string) => void = () => {};
  let icon = 'alert-decagram';
  let state: { list: RequestState; search: RequestState } = {
    list: { loading: { initial: false }, error: true },
    search: { loading: { initial: false }, error: true },
  };
  switch (dataType) {
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
    case 'school':
      data = searchText ? schools.search : schools.data;
      update = (text = searchText) =>
        text ? searchSchools('initial', text, {}) : updateSchools('initial');
      icon = 'school';
      state = schools.state;
      break;
    case 'departement':
      data = (searchText ? departments.search : departments.data).filter(
        (d) => d.type === 'departement',
      );
      update = (text = searchText) =>
        text ? searchDepartments('initial', text, {}) : updateDepartments('initial');
      icon = 'map-marker-radius';
      state = departments.state;
      break;
    case 'region':
      data = (searchText ? departments.search : departments.data).filter(
        (d) => d.type === 'region',
      );
      update = (text = searchText) =>
        text ? searchDepartments('initial', text, {}) : updateDepartments('initial');
      icon = 'map-marker-radius';
      state = departments.state;
      break;
  }

  React.useEffect(() => {
    update();
  }, [dataType]);

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={{ height: 200 }}>
          <View style={styles.centerIllustrationContainer}>
            <Illustration name={dataType} height={200} width={200} />
          </View>
        </View>
        <Divider />
        {state.list.loading.initial ||
          (state.search.loading.initial && <ProgressBar indeterminate style={{ marginTop: -4 }} />)}
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
            onChangeText={setSearchText}
            onIdle={update}
          />
        </View>
        <FlatList
          data={data}
          style={{ maxHeight: 400 }}
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
                description={
                  dataType === 'school'
                    ? item.address?.address?.city || item.address?.shortName
                    : undefined
                }
                left={() =>
                  item.avatar || item.info?.avatar ? (
                    <Avatar avatar={item.avatar || item.info?.avatar} size={50} />
                  ) : (
                    <List.Icon icon={icon} color={item.color} />
                  )
                }
                onPress={() => {
                  if (type === 'articles') {
                    addArticleQuick(dataType, item._id, item.name || item.info?.username);
                  } else {
                    addEventQuick(dataType, item._id, item.name || item.info?.username);
                  }
                  setVisible(false);
                }}
              />
            )
          }
        />
      </View>
    </Modal>
  );
}

const mapStateToProps = (state: State) => {
  const { articleData, eventData, tags, groups, users, schools, departments } = state;
  return {
    articleQuicks: articleData.quicks,
    eventQuicks: eventData.quicks,
    tags,
    groups,
    users,
    schools,
    departments,
  };
};

export default connect(mapStateToProps)(QuickSelectModal);
