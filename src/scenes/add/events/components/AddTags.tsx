import React from 'react';
import { View, Platform, FlatList, ActivityIndicator } from 'react-native';
import { Button, Text, Divider, Card, useTheme, ProgressBar } from 'react-native-paper';
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
} from '@components';
import { updateTags, searchTags, fetchMultiTag } from '@redux/actions/api/tags';
import { updateArticleCreationData } from '@redux/actions/contentData/articles';
import { Account, State, TagRequestState, TagPreload, ArticleCreationData, Tag } from '@ts/types';
import { checkPermission, trackEvent, Permissions, logger } from '@utils';

import TagAddModal from '../../components/TagAddModal';
import getStyles from '../styles';

type ArticleAddPageTagsProps = StepperViewPageProps & {
  account: Account;
  tagsData: TagPreload[];
  tagsSearch: TagPreload[];
  tagsItems: Tag[] | null;
  state: TagRequestState;
  navigate: () => void;
  creationData: ArticleCreationData;
};

const ArticleAddPageTags: React.FC<ArticleAddPageTagsProps> = ({
  prev,
  navigate,
  account,
  tagsData,
  tagsItems,
  tagsSearch,
  state,
  creationData,
}) => {
  const [selectedTags, setSelectedTags] = React.useState<string[]>(creationData.tags || []);
  const [searchText, setSearchText] = React.useState('');

  const [tagAddModalVisible, setTagAddModalVisible] = React.useState(false);

  const fetchTags = () => {
    if (state.info?.loading) return;
    selectedTags.forEach((t) => {
      if (!tagsItems?.some((i) => i._id === t)) {
        logger.debug(`Fetching tag ${t}`);
        fetchMultiTag(t);
      }
    });
  };

  const submit = () => {
    trackEvent('articleadd:page-content');
    updateArticleCreationData({ tags: selectedTags });
    navigate();
  };

  const addNewTag = (tag: { _id: string; displayName: string; color: string }) => {
    setSelectedTags([...selectedTags, tag._id]);
  };

  const inputRef = React.useRef(null);

  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const fetch = () => {
    if (searchText === '') {
      updateTags('initial', { number: 500 });
    } else {
      searchTags('initial', searchText);
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

  React.useEffect(fetchTags, [selectedTags]);

  const ListEmptyComponent = () => {
    return (
      <View style={{ alignItems: 'flex-start' }}>
        {searchText !== '' && state.search?.success && (
          <View
            style={[styles.centerIllustrationContainer, { height: 40, justifyContent: 'center' }]}
          >
            <Text>Aucun résultat</Text>
          </View>
        )}
      </View>
    );
  };

  logger.info(tagsSearch);

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

  const loading =
    (searchText === '' && (state.list.loading.next || state.list.loading.initial)) ||
    (searchText !== '' && (state.search?.loading.next || state.search?.loading.initial));

  return (
    <View style={styles.formContainer}>
      <View>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexGrow: 1, marginRight: 10 }}>
              <Searchbar
                ref={inputRef}
                placeholder="Rechercher un tag"
                value={searchText}
                onChangeText={setSearchText}
                style={loading ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}}
                onIdle={searchChange}
              />
              {loading ? (
                <ProgressBar
                  indeterminate
                  style={{ borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
                />
              ) : (
                <View style={{ height: 4 }} />
              )}
            </View>
            <Button
              mode="outlined"
              icon="plus"
              style={{ justifyContent: 'center', marginBottom: 4 }}
              onPress={() => setTagAddModalVisible(true)}
            >
              Créer
            </Button>
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
          onEndReachedThreshold={0.1}
          data={(searchText === '' ? tagsData : tagsSearch).filter(
            (t) => !selectedTags.includes(t._id),
          )}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(i) => i._id}
        />
      </View>
      <CollapsibleView
        collapsed={selectedTags.length === 0}
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <View style={{ marginBottom: 15 }}>
          <CategoryTitle>Tags sélectionnés</CategoryTitle>
        </View>
        <FlatList
          horizontal
          data={selectedTags.map(
            (t) =>
              tagsItems?.find((u) => u?._id === t) || {
                _id: t,
                name: 'Chargement...',
                color: colors.text,
                displayName: 'Chargement...',
              },
          )}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(i) => i?._id}
        />
      </CollapsibleView>
      <View style={[styles.container, { marginTop: 20 }]}>
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
              les utilisons pour pouvoir faire des recommandations aux utilisateurs.{'\n'}Tapez pour
              rechercher ou pour créer un nouveau tag si aucun ne correspond.
            </Text>
          </View>
        </Card>
      </View>
      <View style={{ marginTop: 30 }}>
        <Divider />
        <View style={styles.buttonContainer}>
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
        visible={tagAddModalVisible}
        setVisible={setTagAddModalVisible}
        add={addNewTag}
      />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, tags, articleData } = state;
  return {
    account,
    tagsData: tags.data,
    tagsSearch: tags.search,
    tagsItems: tags.items,
    state: tags.state,
    creationData: articleData.creationData,
  };
};

export default connect(mapStateToProps)(ArticleAddPageTags);
