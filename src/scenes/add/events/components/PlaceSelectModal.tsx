import React from 'react';
import { View, FlatList } from 'react-native';
import { Divider, ProgressBar, Text, List } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  ModalProps,
  State,
  ArticleQuickItem,
  TagsState,
  GroupsState,
  UsersState,
  RequestState,
} from '@ts/types';
import { useTheme } from '@utils/index';
import { Modal, Searchbar, Illustration, Avatar, ErrorMessage } from '@components/index';
import getStyles from '@styles/Styles';
import { searchTags, updateTags } from '@redux/actions/api/tags';
import { searchUsers, updateUsers } from '@redux/actions/api/users';

type QuickSelectModalProps = ModalProps & {
  quicks: ArticleQuickItem[];
  editingList: ArticleListItem | null;
  setEditingList: (props: ArticleListItem | null) => void;
  type: 'tag' | 'group' | 'user';
  tags: TagsState;
  groups: GroupsState;
  users: UsersState;
};

function PlaceSelectModal({
  visible,
  setVisible,
  type,
  schools,
  places,
  eventPlaces,
}: PlaceSelectModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [searchText, setSearchText] = React.useState('');

  let data: School[] | Place[] = [];
  let update: (text?: string) => void = () => {};
  let icon = 'alert-decagram';
  let state: { list: RequestState; search: RequestState } = {
    list: { loading: { initial: false }, error: true },
    search: { loading: { initial: false }, error: true },
  };
  switch (type) {
    case 'school':
      data = searchText ? schools.search : schools.data;
      update = (text = searchText) =>
        text ? searchTags('initial', text, {}) : updateTags('initial');
      icon = 'school';
      state = schools.state;
      break;
    case 'place':
      data = searchText ? places.search : places.data;
      update = (text = searchText) =>
        text ? searchUsers('initial', text, {}) : updateUsers('initial');
      icon = 'account';
      state = places.state;
      break;
  }

  React.useEffect(() => {
    update();
  }, [null]);

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={{ height: 200 }}>
          <View style={styles.centerIllustrationContainer}>
            <Illustration name={type} height={200} width={200} />
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
            eventPlaces.some((e) => e.id === item._id) ? null : (
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
                  addEventPlace(type, item._id, item.name || item.info?.username);
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
  const { articleData, tags, groups, users } = state;
  return {
    quicks: articleData.quicks,
    tags,
    groups,
    users,
  };
};

export default connect(mapStateToProps)(PlaceSelectModal);
