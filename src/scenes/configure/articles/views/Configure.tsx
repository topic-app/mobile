import React from 'react';
import { View, Platform, FlatList } from 'react-native';
// @ts-expect-error Replace this when we find a better library
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist';
import { Divider, Text, List, Button, Switch } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  PlatformTouchable,
  Illustration,
  TranslucentStatusBar,
  CustomHeaderBar,
} from '@components/index';
import {
  deleteArticleList,
  updateArticlePrefs,
  addArticleQuick,
  deleteArticleQuick,
  reorderArticleQuick,
  reorderArticleList,
} from '@redux/actions/contentData/articles';
import getStyles from '@styles/Styles';
import {
  State,
  ArticleListItem,
  ArticleQuickItem,
  ArticlePrefs,
  Account,
  Preferences,
  EventListItem,
} from '@ts/types';
import { useTheme, Alert } from '@utils/index';

import CreateModal from '../../components/CreateModal';
import EditModal from '../../components/EditModal';
import QuickLocationTypeModal from '../../components/QuickLocationTypeModal';
import QuickSelectModal from '../../components/QuickSelectModal';
import QuickTypeModal from '../../components/QuickTypeModal';
import type { ArticleConfigureScreenNavigationProp } from '../index';
import getArticleStyles from '../styles/Styles';

type ArticleListsProps = {
  lists: ArticleListItem[];
  quicks: ArticleQuickItem[];
  preferences: Preferences;
  articlePrefs: ArticlePrefs;
  account: Account;
  navigation: ArticleConfigureScreenNavigationProp<'Configure'>;
};

type Category = {
  id: string;
  name: string;
  navigate: () => any;
  disable?: boolean;
};

function ArticleLists({
  lists,
  quicks,
  preferences,
  articlePrefs,
  account,
  navigation,
}: ArticleListsProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [isCreateModalVisible, setCreateModalVisible] = React.useState(false);
  const [isEditModalVisible, setEditModalVisible] = React.useState(false);
  const [editingList, setEditingList] = React.useState<ArticleListItem | EventListItem | null>(
    null,
  );
  const [isQuickTypeModalVisible, setQuickTypeModalVisible] = React.useState(false);
  const [isQuickSelectModalVisible, setQuickSelectModalVisible] = React.useState(false);
  const [isQuickLocationTypeModalVisible, setQuickLocationTypeModalVisible] = React.useState(false);
  const [quickType, setQuickType] = React.useState('');

  const next = (data: string) => {
    if (data === 'location') {
      setQuickLocationTypeModalVisible(true);
      setQuickTypeModalVisible(false);
    } else if (data === 'global') {
      addArticleQuick('global', 'global', 'France');
      setQuickLocationTypeModalVisible(false);
    } else {
      setQuickType(data);
      setQuickTypeModalVisible(false);
      setQuickLocationTypeModalVisible(false);
      setQuickSelectModalVisible(true);
    }
  };

  const categoryTypes: Category[] = [
    {
      id: 'unread',
      name: 'Non lus',
      navigate: () =>
        navigation.push('Root', {
          screen: 'Main',
          params: {
            screen: 'Home1',
            params: {
              screen: 'Home2',
              params: { screen: 'Article', params: { initialList: 'unread' } },
            },
          },
        }),
      disable: !preferences.history,
    },
    {
      id: 'all',
      name: 'Tous',
      navigate: () =>
        navigation.push('Root', {
          screen: 'Main',
          params: {
            screen: 'Home1',
            params: {
              screen: 'Home2',
              params: { screen: 'Article', params: { initialList: 'all' } },
            },
          },
        }),
    },
    {
      id: 'following',
      name: 'Suivis',
      navigate: () =>
        navigation.push('Root', {
          screen: 'Main',
          params: {
            screen: 'Home1',
            params: {
              screen: 'Home2',
              params: { screen: 'Article', params: { initialList: 'following' } },
            },
          },
        }),
      disable: !account.loggedIn,
    },
  ];

  let categories: Category[] = [];

  categoryTypes.forEach((c, i) => {
    if (articlePrefs.categories?.includes(c.id)) {
      categories[articlePrefs.categories?.indexOf(c.id)] = c;
    }
  });

  categories = [
    ...categories,
    ...categoryTypes.filter((c) => !articlePrefs.categories?.includes(c.id)),
  ];

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'Configurer',
              subtitle: 'Actus',
            },
          },
        }}
      />
      <FlatList
        data={['categories', 'lists', 'tags']}
        keyExtractor={(s) => s}
        renderItem={({ item: section }) => {
          switch (section) {
            case 'categories':
              return (
                <View>
                  <DraggableFlatList
                    data={categories}
                    scrollPercent={5}
                    keyExtractor={(c: Category) => c.id}
                    ItemSeparatorComponent={() => <Divider />}
                    ListHeaderComponent={() => (
                      <View>
                        <View style={styles.centerIllustrationContainer}>
                          <Illustration name="configure" height={200} width={200} />
                          <View style={[styles.contentContainer, { alignItems: 'center' }]}>
                            <Text>Choisissez les catégories et listes à afficher</Text>
                            <Text>Appuyez longtemps pour réorganiser</Text>
                          </View>
                        </View>
                        <List.Subheader>Catégories</List.Subheader>
                        <Divider />
                      </View>
                    )}
                    renderItem={({
                      item,
                      move,
                      moveEnd,
                    }: {
                      item: Category;
                      move: () => any;
                      moveEnd: () => any;
                    }) => {
                      const enabled = articlePrefs.categories?.some((d) => d === item.id);
                      return (
                        <List.Item
                          key={item.id}
                          title={item.name}
                          description={item.disable ? 'Indisponible' : null}
                          left={() => <View style={{ width: 56, height: 56 }} />}
                          onPress={() => {}}
                          onLongPress={move}
                          titleStyle={!item.disable ? {} : { color: colors.disabled }}
                          descriptionStyle={!item.disable ? {} : { color: colors.disabled }}
                          right={() => (
                            <View style={{ flexDirection: 'row' }}>
                              <Switch
                                disabled={item.disable}
                                value={enabled && !item.disable}
                                color={colors.primary}
                                onValueChange={(val) =>
                                  val
                                    ? updateArticlePrefs({
                                        categories: [...(articlePrefs.categories || []), item.id],
                                      })
                                    : updateArticlePrefs({
                                        categories: articlePrefs.categories?.filter(
                                          (d) => d !== item.id,
                                        ),
                                      })
                                }
                              />
                            </View>
                          )}
                        />
                      );
                    }}
                    ListFooterComponent={() => <Divider />}
                    onMoveEnd={({ to, from }: { to: number; from: number }) => {
                      const tempCategories = articlePrefs.categories;
                      if (articlePrefs.categories && tempCategories) {
                        const buffer = articlePrefs.categories[to];
                        tempCategories[to] = articlePrefs.categories[from];
                        tempCategories[from] = buffer;
                      }
                      updateArticlePrefs({ categories: tempCategories });
                    }}
                  />
                </View>
              );

            case 'lists':
              // TEMP: While lists are not synced to server
              if (Platform.OS === 'web') return null;
              return (
                <DraggableFlatList
                  data={lists}
                  scrollPercent={5}
                  ListHeaderComponent={() => (
                    <View>
                      <View style={articleStyles.listSpacer} />
                      <List.Subheader>Listes</List.Subheader>
                      <View style={articleStyles.subheaderDescriptionContainer}>
                        <Text>
                          Ajoutez vos articles à des listes afin de pouvoir y accéder rapidement.
                        </Text>
                      </View>
                      <Divider />
                    </View>
                  )}
                  ItemSeparatorComponent={() => <Divider />}
                  keyExtractor={(item: ArticleListItem) => item.id}
                  renderItem={({ item, move }: { item: ArticleListItem; move: () => any }) => {
                    return (
                      <List.Item
                        title={item.name}
                        description={`${
                          item.items.length
                            ? `${item.items.length} article${item.items.length === 1 ? '' : 's'}`
                            : 'Aucun article'
                        }${item.description ? `\n${item.description}` : ''}`}
                        descriptionNumberOfLines={100}
                        onPress={() => {}}
                        onLongPress={move}
                        left={() => <List.Icon icon={item.icon} />}
                        right={() => (
                          <View style={{ flexDirection: 'row' }}>
                            <View onStartShouldSetResponder={() => true}>
                              <PlatformTouchable
                                onPress={() => {
                                  setEditingList(item);
                                  setEditModalVisible(true);
                                }}
                              >
                                <List.Icon icon="pencil" />
                              </PlatformTouchable>
                            </View>
                            <View onStartShouldSetResponder={() => true}>
                              <PlatformTouchable
                                disabled={
                                  lists.length === 1 && articlePrefs.categories?.length === 0
                                }
                                onPress={() => {
                                  Alert.alert(
                                    `Voulez-vous vraiment supprimer la liste ${item.name} ?`,
                                    'Cette action est irréversible',
                                    [
                                      {
                                        text: 'Annuler',
                                        onPress: () => {},
                                      },
                                      {
                                        text: 'Supprimer',
                                        onPress: () => deleteArticleList(item.id),
                                      },
                                    ],
                                    {
                                      cancelable: true,
                                    },
                                  );
                                }}
                              >
                                <List.Icon
                                  icon="delete"
                                  color={
                                    lists.length === 1 && articlePrefs.categories?.length === 0
                                      ? colors.disabled
                                      : colors.text
                                  }
                                />
                              </PlatformTouchable>
                            </View>
                          </View>
                        )}
                      />
                    );
                  }}
                  onMoveEnd={({ from, to }: { from: number; to: number }) => {
                    const fromList = lists[from];
                    const toList = lists[to];

                    reorderArticleList(fromList.id, toList.id);
                  }}
                  ListFooterComponent={() => (
                    <View>
                      <Divider />
                      <View style={styles.container}>
                        <Button
                          mode={Platform.OS === 'ios' ? 'text' : 'outlined'}
                          uppercase={Platform.OS !== 'ios'}
                          onPress={() => setCreateModalVisible(true)}
                        >
                          Créer
                        </Button>
                      </View>
                    </View>
                  )}
                />
              );

            case 'tags':
              return (
                <DraggableFlatList
                  data={quicks}
                  ListHeaderComponent={() => (
                    <View>
                      <View style={articleStyles.listSpacer} />

                      <List.Subheader>Tags et groupes</List.Subheader>

                      <View style={articleStyles.subheaderDescriptionContainer}>
                        <Text>
                          Choisissez des sujets et des groupes à afficher pour un accès rapide aux
                          articles qui vous intéressent
                        </Text>
                      </View>
                      <Divider />
                    </View>
                  )}
                  renderItem={({ item, move }: { item: ArticleQuickItem; move: () => any }) => {
                    let content = { description: 'Erreur', icon: 'alert-decagram' };
                    if (item.type === 'tag') {
                      content = {
                        description: 'Tag',
                        icon: 'pound',
                      };
                    } else if (item.type === 'group') {
                      content = {
                        description: 'Groupe',
                        icon: 'account-group',
                      };
                    } else if (item.type === 'user') {
                      content = {
                        description: 'Utilisateur',
                        icon: 'account',
                      };
                    } else if (item.type === 'school') {
                      content = {
                        description: 'École',
                        icon: 'school',
                      };
                    } else if (item.type === 'departement') {
                      content = {
                        description: 'Département',
                        icon: 'map-marker-radius',
                      };
                    } else if (item.type === 'region') {
                      content = { description: 'Région', icon: 'map-marker-radius' };
                    } else if (item.type === 'global') {
                      content = {
                        description: 'Localisation',
                        icon: 'flag',
                      };
                    }
                    return (
                      <View>
                        <List.Item
                          title={item.title}
                          onPress={() => {}}
                          onLongPress={move}
                          description={content.description}
                          left={() => <List.Icon icon={content.icon} />}
                          right={() => (
                            <View style={{ flexDirection: 'row' }}>
                              <PlatformTouchable
                                onPress={() => {
                                  deleteArticleQuick(item.id);
                                }}
                              >
                                <List.Icon icon="delete" />
                              </PlatformTouchable>
                            </View>
                          )}
                        />
                        <Divider />
                      </View>
                    );
                  }}
                  onMoveEnd={({ from, to }: { from: number; to: number }) => {
                    const fromQuick = quicks[from];
                    const toQuick = quicks[to];

                    reorderArticleQuick(fromQuick.id, toQuick.id);
                  }}
                  ListFooterComponent={() => (
                    <View style={styles.container}>
                      <Button
                        mode={Platform.OS === 'ios' ? 'text' : 'outlined'}
                        uppercase={Platform.OS !== 'ios'}
                        onPress={() => {
                          setQuickTypeModalVisible(true);
                        }}
                      >
                        Ajouter
                      </Button>
                    </View>
                  )}
                />
              );

            default:
              return null;
          }
        }}
      />

      <CreateModal
        visible={isCreateModalVisible}
        setVisible={setCreateModalVisible}
        type="articles"
      />
      <EditModal
        visible={isEditModalVisible}
        setVisible={setEditModalVisible}
        editingList={editingList}
        setEditingList={setEditingList}
        type="articles"
      />
      <QuickTypeModal
        type="articles"
        visible={isQuickTypeModalVisible}
        setVisible={setQuickTypeModalVisible}
        next={next}
      />
      <QuickLocationTypeModal
        visible={isQuickLocationTypeModalVisible}
        setVisible={setQuickLocationTypeModalVisible}
        next={next}
      />
      <QuickSelectModal
        visible={isQuickSelectModalVisible}
        setVisible={setQuickSelectModalVisible}
        dataType={quickType}
        type="articles"
      />
    </View>
  );
}

const mapStateToProps = (state: State) => {
  const { articleData, preferences, account } = state;
  return {
    lists: articleData.lists,
    quicks: articleData.quicks,
    articlePrefs: articleData.prefs,
    preferences,
    account,
  };
};

export default connect(mapStateToProps)(ArticleLists);
