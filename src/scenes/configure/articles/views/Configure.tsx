import React from 'react';
import { Divider, Text, List, Button, Switch } from 'react-native-paper';
import { View, Platform, FlatList, Alert } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist';

import {
  State,
  ArticleListItem,
  ArticleQuickItem,
  ArticlePrefs,
  Account,
  Preferences,
} from '@ts/types';
import {
  PlatformTouchable,
  Illustration,
  TranslucentStatusBar,
  CustomHeaderBar,
} from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';
import {
  deleteArticleList,
  updateArticlePrefs,
  addArticleQuick,
  deleteArticleQuick,
  modifyArticleList,
} from '@redux/actions/contentData/articles';
import getArticleStyles from '../styles/Styles';

import type { ArticleListsStackParams } from '../index';
import CreateModal from '../../components/CreateModal';
import EditModal from '../../components/EditModal';
import QuickTypeModal from '../../components/QuickTypeModal';
import QuickSelectModal from '../../components/QuickSelectModal';
import QuickLocationTypeModal from '../../components/QuickLocationTypeModal';

type ArticleListsProps = {
  lists: ArticleListItem[];
  quicks: ArticleQuickItem[];
  preferences: Preferences;
  articlePrefs: ArticlePrefs;
  account: Account;
  navigation: StackNavigationProp<ArticleListsStackParams, 'Configure'>;
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
  const [editingList, setEditingList] = React.useState(null);
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
        navigation.push('Main', {
          screen: 'Home1',
          params: {
            screen: 'Home2',
            params: { screen: 'Article', params: { initialList: 'unread' } },
          },
        }),
      disable: !preferences.history,
    },
    {
      id: 'all',
      name: 'Tous',
      navigate: () =>
        navigation.push('Main', {
          screen: 'Home1',
          params: {
            screen: 'Home2',
            params: { screen: 'Article', params: { initialList: 'all' } },
          },
        }),
      disable: !preferences.history,
    },
    {
      id: 'following',
      name: 'Suivis',
      navigate: () =>
        navigation.push('Main', {
          screen: 'Home1',
          params: {
            screen: 'Home2',
            params: { screen: 'Article', params: { initialList: 'following' } },
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
                    keyExtractor={(c) => c.id}
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
                    renderItem={({ item, move, moveEnd }) => {
                      const enabled = articlePrefs.categories?.some((d) => d === item.id);
                      return (
                        <List.Item
                          key={item.id}
                          title={item.name}
                          description={
                            item.disable
                              ? null
                              : "Activez l'historique pour voir les articles non lus"
                          }
                          left={() => <List.Icon />}
                          onPress={enabled ? item.navigate : () => null}
                          onLongPress={move}
                          disabled={!preferences.history && item.historyDisable}
                          titleStyle={!item.disable ? {} : { color: colors.disabled }}
                          descriptionStyle={!item.disable ? {} : { color: colors.disabled }}
                          right={() => (
                            <View style={{ flexDirection: 'row' }}>
                              <Switch
                                disabled={item.disable}
                                value={enabled && !item.disable}
                                color={colors.primary}
                                onTouchEnd={
                                  enabled
                                    ? () =>
                                        updateArticlePrefs({
                                          categories: articlePrefs.categories.filter(
                                            (d) => d !== item.id,
                                          ),
                                        })
                                    : () =>
                                        updateArticlePrefs({
                                          categories: [...articlePrefs.categories, item.id],
                                        })
                                }
                              />
                            </View>
                          )}
                        />
                      );
                    }}
                    ListFooterComponent={() => <Divider />}
                    onMoveEnd={({ to, from }) => {
                      const tempCategories = articlePrefs.categories;
                      const buffer = articlePrefs.categories[to];
                      tempCategories[to] = articlePrefs.categories[from];
                      tempCategories[from] = buffer;
                      updateArticlePrefs({ categories: tempCategories });
                    }}
                  />
                </View>
              );

            case 'lists':
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
                        <Text>
                          Les articles ajoutés seront disponibles hors-ligne
                          {account.loggedIn && preferences.syncLists
                            ? ' et seront sauvegardés sur votre compte.'
                            : '.'}
                        </Text>
                      </View>
                      <Divider />
                    </View>
                  )}
                  ItemSeparatorComponent={() => <Divider />}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, move }) => {
                    return (
                      <List.Item
                        title={item.name}
                        description={`${
                          item.items.length
                            ? `${item.items.length} article${item.items.length === 1 ? '' : 's'}`
                            : 'Aucun article'
                        }${item.description ? `\n${item.description}` : ''}`}
                        descriptionNumberOfLines={100}
                        onPress={() =>
                          navigation.push('Main', {
                            screen: 'Home1',
                            params: {
                              screen: 'Home2',
                              params: {
                                screen: 'Article',
                                params: { initialList: item.id },
                              },
                            },
                          })
                        }
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
                                    `Voulez vous vraiment supprimer la liste ${item.name}?`,
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
                  onMoveEnd={({ from, to }) => {
                    const fromList = lists[from];
                    const toList = lists[to];

                    modifyArticleList(
                      fromList.id,
                      toList.name,
                      toList.icon,
                      toList.description,
                      toList.items,
                    );
                    modifyArticleList(
                      toList.id,
                      fromList.name,
                      fromList.icon,
                      fromList.description,
                      fromList.items,
                    );
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
                <FlatList
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
                  renderItem={({ item }) => {
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
