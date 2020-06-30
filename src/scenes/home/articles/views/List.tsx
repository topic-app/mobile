import React from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ProgressBar, Button, Text, withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

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

function ArticleList({ navigation, articles, lists, read, state, theme }) {
  const scrollY = new Animated.Value(0);

  useFocusEffect(
    React.useCallback(() => {
      updateArticles('initial');
    }, [null]),
  );

  const categories = [
    {
      key: 'unread',
      title: 'Non lus',
      data: articles.filter((a) => !read.includes(a._id)),
      type: 'category',
    },
    { key: 'all', title: 'Tous', data: articles, type: 'category' },
    ...lists.map((l) => {
      return { key: l.id, title: l.name, data: l.items, useLists: true, type: 'category' };
    }),
  ];

  const [category, setCategory] = React.useState('unread');

  const { colors } = theme;
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const ArticleIllustration = () => {
    if (state.list.success) {
      if (category === 'unread') {
        return (
          <View>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="article-completed" height={400} width={400} />
              <Text>Vous avez lu tous les articles !</Text>
            </View>
          </View>
        );
      } else if (category === 'all') {
        return (
          <View>
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
          </View>
        );
      } else {
        return (
          <View>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="article-lists" height={400} width={400} />
              <Text>Aucun article dans cette liste</Text>
              <View style={styles.contentContainer}>
                <Text style={articleStyles.captionText}>
                  Ajoutez les grâce à l&apos;icone <Icon name="playlist-plus" size={20} />
                </Text>
              </View>
            </View>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.centerIllustrationContainer}>
          <Illustration name="article-greyed" height={400} width={400} />
        </View>
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
        data={categories.find((c) => c.key === category).data || []}
        refreshing={state.list.loading.refresh}
        onRefresh={() => updateArticles('refresh')}
        onEndReached={() => updateArticles('next')}
        ListHeaderComponent={() => (
          <View>
            <CategoriesList categories={categories} selected={category} setSelected={setCategory} />
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
        renderItem={(article) => (
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
                      useLists: categories.find((c) => c.key === category)?.useLists,
                    },
                  },
                },
              })
            }
          />
        )}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  const { articles } = state;
  return {
    articles: articles.data,
    lists: articles.lists,
    read: articles.read,
    state: articles.state,
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
