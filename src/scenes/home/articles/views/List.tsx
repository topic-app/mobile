import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Animated,
  Platform,
  ActivityIndicator,
  AccessibilityInfo,
  Dimensions,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  ProgressBar,
  Button,
  Banner,
  Text,
  Subheading,
  Avatar,
  withTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import CollapsibleView from '@components/CollapsibleView';
import TabChipList from '@components/TabChipList';
import {
  addArticleRead,
  deleteArticleRead,
  addArticleToList,
  removeArticleFromList,
} from '@redux/actions/contentData/articles';
import { PlatformTouchable } from '@components/PlatformComponents';
import { connect } from 'react-redux';

import {
  State,
  ArticleListItem,
  ArticleReadItem,
  Article,
  ArticlePrefs,
  Preferences,
} from '@ts/types';
import {
  AnimatingHeader,
  ErrorMessage,
  Illustration,
  CategoriesList,
  ArticleCard,
} from '@components/index';
import { updateArticles } from '@redux/actions/api/articles';
import getStyles from '@styles/Styles';

import getArticleStyles from '../styles/Styles';

type Category = {
  key: string;
  title: string;
  description?: string;
  data: any[];
  type: string;
  list?: boolean;
};

type ArticleListProps = {
  navigation: any;
  articles: Article[];
  lists: ArticleListItem[];
  read: ArticleReadItem[];
  articlePrefs: ArticlePrefs;
  preferences: Preferences;
};

function ArticleList({
  navigation,
  articles,
  search,
  lists,
  read,
  quicks,
  state,
  theme,
  articlePrefs,
  preferences,
  route,
}: ArticleListProps) {
  const scrollY = new Animated.Value(0);
  const { colors } = theme;
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const categoryTypes = [
    {
      key: 'all',
      title: 'Tous',
      data: articles,
      type: 'category',
    },
  ];

  if (preferences.history) {
    categoryTypes.unshift({
      key: 'unread',
      title: 'Non lus',
      data: articles.filter((a) => !read.some((r) => r.id === a._id)),
      type: 'category',
    });
  }

  const categories: Category[] = [];

  articlePrefs.categories.forEach((c) => {
    const currentCategory = categoryTypes.find((d) => d.key === c);
    if (currentCategory) {
      categories.push(currentCategory);
    }
  });

  const tabs: { key: string; data: Category[] }[] = [
    {
      key: 'categories',
      data: categories,
    },
    {
      key: 'lists',
      data: lists.map((l) => ({
        key: l.id,
        title: l.name,
        description: l.description,
        icon: l.icon,
        data: l.items,
        list: true,
        type: 'list',
      })),
    },
    {
      key: 'quicks',
      data: quicks.map((q) => {
        let params = {};
        let icon = 'alert-decagram';
        switch (q.type) {
          case 'tag':
            params = { tags: [q.id] };
            icon = 'pound';
            break;
          case 'user':
            params = { users: [q.id] };
            icon = 'account';
            break;
          case 'group':
            params = { groups: [q.id] };
            icon = 'account-multiple';
            break;
        }
        return {
          key: q.id,
          title: q.title,
          icon,
          data: search,
          params,
          quickType: q.type,
          type: 'quick',
        };
      }),
    },
  ];

  const [tab, setTab] = React.useState(route.params?.initialList || tabs[0].data[0].key);
  const [chipTab, setChipTab] = React.useState(tab);

  const getSection = () => tabs.find((t) => t.data.some((d) => d.key === tab));

  const getItem = () =>
    tabs.find((t) => t.key === getSection()?.key)?.data.find((d) => d.key === tab);

  useFocusEffect(
    React.useCallback(() => {
      updateArticles('initial');
    }, [null]),
  );

  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const changeList = async (data) => {
    const noAnimation = await AccessibilityInfo.isReduceMotionEnabled();
    if (noAnimation) {
      setChipTab(data);
      setTab(data);
    } else {
      setChipTab(data);
      Animated.timing(fadeAnim, {
        useNativeDriver: true,
        toValue: 0,
        duration: 100,
      }).start(() => {
        setTab(data);
        Animated.timing(fadeAnim, {
          useNativeDriver: true,
          toValue: 1,
          duration: 100,
        }).start();
      });
    }
  };

  const renderRightActions = (id) => {
    return (
      <View style={[styles.centerIllustrationContainer, { width: '100%', alignItems: 'flex-end' }]}>
        {getSection()?.key !== 'lists' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}
          >
            <Text style={articleStyles.captionText}>
              Marquer comme {read.some((r) => r.id === id) ? 'non lu' : 'lu'}
            </Text>
            <Icon
              name={read.some((r) => r.id === id) ? 'eye-off' : 'eye'}
              size={32}
              style={{ marginHorizontal: 10 }}
              color={colors.disabled}
            />
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}
          >
            <Text style={articleStyles.captionText}>Retirer</Text>
            <Icon
              name="delete"
              color={colors.disabled}
              size={32}
              style={{ marginHorizontal: 10 }}
            />
          </View>
        )}
      </View>
    );
  };

  const renderLeftActions = (id, swipeRef) => {
    return (
      <View
        style={[
          styles.container,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
        ]}
      >
        {lists.slice(0, (Dimensions.get('window').width - 100) / 120).map((l) => (
          <View key={l.id} style={{ width: 120 }}>
            <PlatformTouchable
              onPress={() => {
                console.log('Add to list');
                if (lists.find((j) => j.id === l.id)?.items.some((i) => i._id === id)) {
                  Alert.alert(
                    `Retirer l'article de la liste ${lists.find((j) => j.id === l.id)?.name} ?`,
                    "L'article ne sera plus disponible hors-ligne",
                    [
                      {
                        text: 'Annuler',
                      },
                      {
                        text: 'Retirer',
                        onPress: () => removeArticleFromList(id, l.id),
                      },
                    ],
                    { cancelable: true },
                  );
                } else {
                  addArticleToList(id, l.id);
                }
                swipeRef.current?.close();
              }}
            >
              <View style={{ alignItems: 'center', margin: 10 }}>
                <Icon
                  name={l.icon || 'playlist-plus'}
                  size={32}
                  color={
                    lists.find((j) => j.id === l.id)?.items.some((i) => i._id === id)
                      ? colors.primary
                      : colors.disabled
                  }
                />
                <Text
                  style={{
                    color: lists.find((j) => j.id === l.id)?.items.some((i) => i._id === id)
                      ? colors.primary
                      : colors.disabled,
                  }}
                >
                  {l.name}
                </Text>
              </View>
            </PlatformTouchable>
          </View>
        ))}
      </View>
    );
  };

  const swipeRightAction = (id, swipeRef) => {
    swipeRef.current?.close();
    if (getSection()?.key !== 'lists') {
      if (read.some((r) => r.id === id)) {
        deleteArticleRead(id);
      } else {
        addArticleRead(id);
      }
    } else {
      removeArticleFromList(id, getItem()?.key);
    }
  };

  const ArticleIllustration = () => {
    if (state.list.success || getSection()?.key === 'lists') {
      if (tab === 'unread') {
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="article-completed" height={400} width={400} />
              <Text>Vous avez lu tous les articles !</Text>
            </View>
          </Animated.View>
        );
      } else if (tab === 'all') {
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="article" height={400} width={400} />
              <Text>Aucun article pour cette localisation</Text>
            </View>
            <View style={styles.container}>
              <Button
                mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() =>
                  navigation.navigate('Main', {
                    screen: 'Params',
                    params: {
                      screen: 'Article',
                    },
                  })
                }
              >
                Localisation
              </Button>
            </View>
          </Animated.View>
        );
      } else {
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="article-lists" height={400} width={400} />
              <Text>Aucun article dans cette liste</Text>
              <View style={styles.contentContainer}>
                <Text style={articleStyles.captionText}>
                  Ajoutez les grâce à l&apos;icone <Icon name="playlist-plus" size={20} />
                </Text>
              </View>
            </View>
          </Animated.View>
        );
      }
    } else {
      return (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.centerIllustrationContainer}>
            <Illustration name="article-greyed" height={400} width={400} />
          </View>
        </Animated.View>
      );
    }
  };

  return (
    <View style={styles.page}>
      <AnimatingHeader
        home
        value={scrollY}
        title="Actus"
        actions={[
          {
            icon: 'magnify',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Search',
                params: {
                  screen: 'Search',
                  params: { initialCategory: 'articles', previous: 'Actus' },
                },
              }),
          },
        ]}
        overflow={[
          {
            title: 'Catégories',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Configure',
                params: {
                  screen: 'Article',
                },
              }),
          },
          {
            title: 'Localisation',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Params',
                params: {
                  screen: 'Article',
                },
              }),
          },
        ]}
      >
        {state.list.loading.initial && <ProgressBar indeterminate style={{ marginTop: -4 }} />}
        {state.list.error ? (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération des articles',
              contentPlural: 'des articles',
              contentSingular: "La liste d'articles",
            }}
            error={state.list.error}
            retry={() => updateArticles('initial')}
          />
        ) : null}
      </AnimatingHeader>
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        data={getItem().data || []}
        refreshing={state.list.loading.refresh}
        onRefresh={getSection()?.key !== 'lists' ? () => updateArticles('refresh') : undefined}
        onEndReached={getSection()?.key !== 'lists' ? () => updateArticles('next') : undefined}
        ListHeaderComponent={() => (
          <View>
            <TabChipList
              sections={tabs}
              selected={chipTab}
              setSelected={changeList}
              configure={() =>
                navigation.navigate('Main', {
                  screen: 'Configure',
                  params: {
                    screen: 'Article',
                  },
                })
              }
            />
            {getItem()?.description ? (
              <Banner actions={[]} visible>
                <Text>
                  <Subheading>Description</Subheading>
                  {'\n'}
                  <Text>{getItem()?.description}</Text>
                </Text>
              </Banner>
            ) : null}
          </View>
        )}
        ListEmptyComponent={ArticleIllustration}
        onEndReachedThreshold={0.5}
        keyExtractor={(article) => article._id}
        ListFooterComponent={
          <View style={[styles.container, { height: 50 }]}>
            {state.list.loading.next && <ActivityIndicator size="large" color={colors.primary} />}
          </View>
        }
        renderItem={(article) => {
          const swipeRef = React.createRef();
          return (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Swipeable
                ref={swipeRef}
                renderLeftActions={() => renderLeftActions(article.item._id, swipeRef)}
                renderRightActions={
                  preferences.history || getSection().key !== 'lists'
                    ? () => renderRightActions(article.item._id)
                    : null
                }
                onSwipeableRightOpen={
                  preferences.history || getSection().key !== 'lists'
                    ? () => swipeRightAction(article.item._id, swipeRef)
                    : null
                }
              >
                <ArticleCard
                  unread={!read.some((r) => r.id === article.item._id) || getItem().key !== 'all'}
                  article={article.item}
                  navigate={() =>
                    navigation.navigate('Main', {
                      screen: 'Display',
                      params: {
                        screen: 'Article',
                        params: {
                          screen: 'Display',
                          params: {
                            id: article.item._id,
                            title: article.item.title,
                            useLists: getSection().key === 'lists',
                          },
                        },
                      },
                    })
                  }
                />
              </Swipeable>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const mapStateToProps = (state: State) => {
  const { articles, articleData, preferences } = state;
  return {
    articles: articles.data,
    search: articles.search,
    articlePrefs: articleData.prefs,
    lists: articleData.lists,
    quicks: articleData.quicks,
    read: articleData.read,
    state: articles.state,
    preferences,
  };
};

export default connect(mapStateToProps)(withTheme(ArticleList));

ArticleList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string,
      description: PropTypes.string,
    }).isRequired,
  ).isRequired,
  state: PropTypes.shape({
    list: PropTypes.shape({
      success: PropTypes.bool,
      loading: PropTypes.shape({
        next: PropTypes.bool,
        initial: PropTypes.bool,
        refresh: PropTypes.bool,
      }),
      error: PropTypes.oneOf([PropTypes.object, null]), // TODO: Better PropTypes
    }).isRequired,
  }).isRequired,
  read: PropTypes.arrayOf(PropTypes.string),
  theme: PropTypes.shape({
    dark: PropTypes.bool.isRequired,
    colors: PropTypes.shape({
      primary: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
