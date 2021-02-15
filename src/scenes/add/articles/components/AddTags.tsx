import React from 'react';
import { View, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Button, Text, Divider, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import shortid from 'shortid';

import {
  StepperViewPageProps,
  ErrorMessage,
  TextChip,
  CollapsibleView,
  CategoryTitle,
  Searchbar,
} from '@components/index';
import { Permissions } from '@constants/index';
import { updateTags, searchTags } from '@redux/actions/api/tags';
import { updateArticleCreationData } from '@redux/actions/contentData/articles';
import getStyles from '@styles/Styles';
import { Account, State, TagRequestState, TagPreload } from '@ts/types';
import { checkPermission, trackEvent, useTheme } from '@utils/index';

import TagAddModal from '../../components/TagAddModal';
import getAuthStyles from '../styles/Styles';

type ArticleAddPageTagsProps = StepperViewPageProps & {
  account: Account;
  tagsData: TagPreload[];
  tagsSearch: TagPreload[];
  state: TagRequestState;
  navigate: () => void;
};

const ArticleAddPageTags: React.FC<ArticleAddPageTagsProps> = ({
  prev,
  navigate,
  account,
  tagsData,
  tagsSearch,
  state,
}) => {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [selectedData, setSelectedData] = React.useState<TagPreload[]>([]);
  const [searchText, setSearchText] = React.useState('');

  const [tagAddModalVisible, setTagAddModalVisible] = React.useState(false);
  const [tagName, setTagName] = React.useState<string>('');

  const submit = () => {
    trackEvent('articleadd:page-content');
    updateArticleCreationData({ tags: selectedTags });
    navigate();
  };

  const addNewTag = (tag: { _id: string; displayName: string; color: string }) => {
    setSelectedTags([...selectedTags, tag._id]);
    setSelectedData([...selectedData, tag]);
  };

  const inputRef = React.useRef(null);

  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const fetch = () => {
    if (searchText === '') {
      updateTags('initial');
    } else {
      searchTags('initial', searchText);
    }
  };

  const fetchNext = () => {
    if (searchText === '') {
      updateTags('next');
    } else {
      searchTags('next', searchText);
    }
  };

  const searchChange = (text: string) => {
    if (text !== '') {
      searchTags('initial', text);
    }
  };

  React.useEffect(() => {
    fetch();
  }, [null]);

  const ListEmptyComponent = () => {
    return (
      <View style={{ alignItems: 'flex-start' }}>
        {searchText !== '' &&
        state.search?.success &&
        !selectedData.some((t) => t.name?.toLowerCase() === searchText?.toLowerCase()) &&
        checkPermission(account, {
          permission: Permissions.TAG_ADD,
          scope: {},
        }) ? (
          <TextChip
            title={`Créer "${searchText
              .toLowerCase()
              .replace(/[^a-zA-Z0-9ùúûüéèêëàáâä]/g, '')
              .replace(/[éèêë]/g, 'e')
              .replace(/[àáâä]/g, 'a')
              .replace(/[ùúûü]/g, 'u')}"`}
            icon="plus"
            onPress={() => {
              trackEvent('articleadd:tags-create-start');
              setTagName(
                searchText
                  .toLowerCase()
                  .replace(/[^a-zA-Z0-9ùúûüéèêëàáâä]/g, '')
                  .replace(/[éèêë]/g, 'e')
                  .replace(/[àáâä]/g, 'a')
                  .replace(/[ùúûü]/g, 'u'),
              );
              setTagAddModalVisible(true);
            }}
          />
        ) : (
          searchText !== '' &&
          state.search?.success && (
            <View
              style={[styles.centerIllustrationContainer, { height: 40, justifyContent: 'center' }]}
            >
              <Text>Aucun résultat</Text>
            </View>
          )
        )}
      </View>
    );
  };

  const ListHeaderComponent = () =>
    (searchText === '' && state.list.loading.initial) ||
    (searchText !== '' && state.search?.loading.initial) ? (
      <View style={{ marginVertical: 5, height: 40, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ) : null;

  const ListFooterComponent = () =>
    (searchText === '' && state.list.loading.next) ||
    (searchText !== '' && state.search?.loading.next) ? (
      <View style={{ marginVertical: 5, height: 40, width: 40, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    ) : null;

  const renderItem = React.useCallback(
    ({
      item = { _id: shortid(), displayName: 'INCONNU', color: '#ffffff' },
    }: {
      item: TagPreload;
    }) => {
      return (
        <View style={{ marginHorizontal: 5, alignItems: 'flex-start' }}>
          <TextChip
            title={item.displayName}
            containerStyle={{ borderColor: item.color }}
            onPress={() => {
              if (selectedTags.includes(item._id)) {
                trackEvent('articleadd:tags-remove');
                setSelectedTags(selectedTags.filter((s) => s !== item._id));
              } else {
                trackEvent('articleadd:tags-add');
                setSelectedTags([...selectedTags, item._id]);
                setSelectedData([...selectedData, item]);
              }
            }}
            icon={selectedTags.includes(item._id) ? 'check' : 'pound'}
            selected={selectedTags.includes(item._id)}
          />
        </View>
      );
    },
    [selectedTags],
  );

  let onEndReachedCalledDuringMomentum = false;

  return (
    <View style={articleStyles.formContainer}>
      <View>
        <View>
          <View>
            <Searchbar
              ref={inputRef}
              placeholder={`Rechercher ${
                checkPermission(account, {
                  permission: Permissions.TAG_ADD,
                  scope: {},
                })
                  ? 'ou créer '
                  : ''
              }un tag`}
              value={searchText}
              onChangeText={setSearchText}
              onIdle={searchChange}
            />
          </View>
          {((searchText === '' && state.list.error) ||
            (searchText !== '' && state.search?.error)) && (
            <ErrorMessage
              type="axios"
              error={searchText === '' ? state.list.error : state.search?.error}
              retry={fetch}
              strings={{
                what: 'la récupération des tags',
                contentPlural: 'Les tags',
              }}
            />
          )}
        </View>
      </View>
      <View style={{ marginTop: 20, height: 40 }}>
        <FlatList
          horizontal
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum = true;
          }}
          onMomentumScrollEnd={() => {
            onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (onEndReachedCalledDuringMomentum) {
              fetchNext();
            }
          }}
          onEndReachedThreshold={0.1}
          data={(searchText === '' ? tagsData : tagsSearch).filter(
            (t) => !selectedTags.includes(t._id),
          )}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(i) => i._id}
        />
      </View>
      <CollapsibleView collapsed={selectedTags.length === 0} style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 15 }}>
          <CategoryTitle>Tags sélectionnés</CategoryTitle>
        </View>
        <FlatList
          horizontal
          data={selectedTags.map((t) => selectedData.find((u) => u?._id === t)!).filter((s) => !!s)}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(i) => i?._id}
        />
      </CollapsibleView>
      <View style={[styles.container, { marginTop: 40 }]}>
        <Card
          elevation={0}
          style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
        >
          <View style={[styles.container, { flexDirection: 'row' }]}>
            <Icon
              name="tag-multiple"
              style={{ alignSelf: 'center', marginRight: 10 }}
              size={24}
              color={colors.primary}
            />
            <Text style={{ color: colors.text, flex: 1 }}>
              Les tags permettent aux utilisateurs de trouver plus facilement vos articles,et nous
              les utilisons pour pouvoir faire des recommendations aux utilisateurs.{'\n'}Tapez pour
              rechercher ou pour créer un nouveau tag si aucun ne correspond.
            </Text>
          </View>
        </Card>
      </View>
      <View style={{ marginTop: 30 }}>
        <Divider />
        <View style={articleStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => prev()}
            style={{ flex: 1, marginRight: 5 }}
          >
            Retour
          </Button>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={submit}
            style={{ flex: 1, marginLeft: 5 }}
          >
            Suivant
          </Button>
        </View>
      </View>

      <TagAddModal
        name={tagName}
        visible={tagAddModalVisible}
        setVisible={setTagAddModalVisible}
        add={addNewTag}
      />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, tags } = state;
  return {
    account,
    tagsData: tags.data,
    tagsSearch: tags.search,
    state: tags.state,
  };
};

export default connect(mapStateToProps)(ArticleAddPageTags);
