import React from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Platform, ActivityIndicator } from 'react-native';
import { ProgressBar, Button, Text, withTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import AnimatingHeader from '@components/AnimatingHeader';
import ErrorMessage from '@components/ErrorMessage';
import { updateArticles } from '@redux/actions/api/articles';
import getStyles from '@styles/Styles';
import IllustrationArticlesGreyedLight from '@assets/images/illustrations/articles/articles_greyed_light.svg';
import IllustrationArticlesGreyedDark from '@assets/images/illustrations/articles/articles_greyed_dark.svg';
import Avatar from '@components/Avatar';
import LinearGradient from 'react-native-linear-gradient';

import ArticleCard from '../components/Card';

function ArticleList({ navigation, articles, state, theme }) {
  const scrollY = new Animated.Value(0);

  useFocusEffect(
    React.useCallback(() => {
      updateArticles('initial');
    }, [null]),
  );

  const { colors } = theme;
  const styles = getStyles(theme);

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
        ]}
      >
        {state.list.loading.initial && <ProgressBar indeterminate />}
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
        data={articles}
        refreshing={state.list.loading.refresh}
        onRefresh={() => updateArticles('refresh')}
        onEndReached={() => updateArticles('next')}
        ListEmptyComponent={() => (
          <View style={styles.centerIllustrationContainer}>
            {theme.dark ? (
              <IllustrationArticlesGreyedDark height={400} width={400} />
            ) : (
              <IllustrationArticlesGreyedLight height={400} width={400} />
            )}
            {state.list.success && (
              <View>
                <Text>Aucun article pour cette localisation</Text>
                <View style={styles.container}>
                  <Button
                    mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
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
                    Changer
                  </Button>
                </View>
              </View>
            )}
          </View>
        )}
        onEndReachedThreshold={0.5}
        keyExtractor={(article) => article._id}
        ListFooterComponent={
          <View style={[styles.container, { height: 50 }]}>
            {state.list.loading.next && <ActivityIndicator size="large" color={colors.primary} />}
          </View>
        }
        renderItem={(article) => (
          <ArticleCard
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
  return { articles: articles.data, state: articles.state };
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
  theme: PropTypes.shape({
    dark: PropTypes.bool.isRequired,
    colors: PropTypes.shape({
      primary: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
