import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Animated,
  Platform,
  ActivityIndicator,
  AccessibilityInfo,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ProgressBar, Button, Text, withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import CollapsibleView from '@components/CollapsibleView';
import {
  addArticleRead,
  deleteArticleRead,
  addArticleToList,
  removeArticleFromList,
} from '@redux/actions/lists/articles';
import { PlatformTouchable } from '@components/PlatformComponents';
import { connect } from 'react-redux';

import { State } from '@ts/types';
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

function ArticleList({ navigation, articles, lists, read, state, theme, preferences }) {
  const scrollY = new Animated.Value(0);

  useFocusEffect(
    React.useCallback(() => {
      updateArticles('initial');
    }, [null]),
  );

  const categories = preferences.history
    ? [
        {
          key: 'unread',
          title: 'Non lus',
          data: articles.filter((a) => !read.includes(a._id)),
          type: 'category',
        },
        { key: 'all', title: 'Tous', data: articles, type: 'category' },
        ...lists.map((l) => ({
          key: l.id,
          title: l.name,
          data: l.items,
          list: true,
          type: 'category',
        })),
      ]
    : [
        { key: 'all', title: 'Tous', data: articles, type: 'category' },
        ...lists.map((l) => ({
          key: l.id,
          title: l.name,
          data: l.items,
          list: true,
          type: 'category',
        })),
      ];

  const [category, setCategory] = React.useState(categories[0].key);

  const { colors } = theme;
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const changeList = async (data) => {
    const noAnimation = await AccessibilityInfo.isReduceMotionEnabled();
    if (noAnimation) {
      setCategory(data);
    } else {
      Animated.timing(fadeAnim, {
        useNativeDriver: true,
        toValue: 0,
        duration: 100,
      }).start(() => {
        setCategory(data);
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
        {!categories.find((c) => c.key === category)?.list ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}
          >
            <Text style={articleStyles.captionText}>
              Marquer comme {read.includes(id) ? 'non lu' : 'lu'}
            </Text>
            <Icon
              name={read.includes(id) ? 'eye-off' : 'eye'}
              size={32}
              style={{ marginHorizontal: 10 }}
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
            <Icon name="delete" size={32} style={{ marginHorizontal: 10 }} />
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
          <View style={{ width: 120 }}>
            <PlatformTouchable
              onPress={() => {
                console.log('Add to list');
                addArticleToList(id, l.id);
                swipeRef.current?.close();
              }}
            >
              <View style={{ alignItems: 'center', margin: 10 }}>
                <Icon
                  name={l.icon || 'playlist-plus'}
                  size={32}
                  color={
                    lists.find((j) => j.id === l.id).items.some((i) => i._id === id)
                      ? colors.primary
                      : null
                  }
                />
                <Text
                  style={{
                    color: lists.find((j) => j.id === l.id).items.some((i) => i._id === id)
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
    if (!categories.find((c) => c.key === category)?.list) {
      if (read.includes(id)) {
        deleteArticleRead(id);
      } else {
        addArticleRead(id);
      }
    } else {
      removeArticleFromList(id, categories.find((c) => c.key === category).key);
    }
  };

  const ArticleIllustration = () => {
    if (state.list.success || categories.find((c) => c.key === category)?.list) {
      if (category === 'unread') {
        return (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="article-completed" height={400} width={400} />
              <Text>Vous avez lu tous les articles !</Text>
            </View>
          </Animated.View>
        );
      } else if (category === 'all') {
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
                    screen: 'Configure',
                    params: {
                      screen: 'Article',
                    },
                  })
                }
              >
                Configurer
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
            title: 'Configurer',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Configure',
                params: {
                  screen: 'Article',
                },
              }),
          },
          {
            title: 'Listes',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Lists',
                params: {
                  screen: 'Article',
                },
              }),
          },
          {
            title: 'TEMP Profile',
            onPress: () =>
              navigation.navigate('More', {
                screen: 'More',
                params: {
                  screen: 'Profile',
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
        data={categories.find((c) => c.key === category)?.data || []}
        refreshing={state.list.loading.refresh}
        onRefresh={
          category === 'unread' || category === 'all' ? () => updateArticles('refresh') : null
        }
        onEndReached={
          category === 'unread' || category === 'all' ? () => updateArticles('next') : null
        }
        ListHeaderComponent={() => (
          <View>
            <CategoriesList categories={categories} selected={category} setSelected={changeList} />
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
                renderRightActions={() => renderRightActions(article.item._id)}
                renderLeftActions={
                  preferences.history || categories.find((c) => c.key === category)?.list
                    ? () => renderLeftActions(article.item._id, swipeRef)
                    : null
                }
                onSwipeableRightOpen={
                  preferences.history || categories.find((c) => c.key === category)?.list
                    ? () => swipeRightAction(article.item._id, swipeRef)
                    : null
                }
              >
                <ArticleCard
                  unread={
                    !read.includes(article.item._id) ||
                    categories.find((c) => c.key === category).key !== 'all'
                  }
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
                            useLists: categories.find((c) => c.key === category)?.list,
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
  const { articles, preferences } = state;
  return {
    articles: articles.data,
    lists: articles.lists,
    read: articles.read,
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
