import React from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Platform, ActivityIndicator } from 'react-native';
import { ProgressBar, withTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar, TranslucentStatusBar } from '@components/Header';
import { updateArticles } from '@redux/actions/articles';
import getStyles from '@styles/Styles';

import ArticleCard from '../components/Card';

function ArticleList({ navigation, articles, state, theme }) {
  React.useEffect(() => {
    updateArticles('initial');
  }, []);

  const scrollY = new Animated.Value(0);

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [0, 10],
    extrapolate: 'clamp',
  });

  const { colors } = theme;
  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      {Platform.OS !== 'ios' ? (
        <Animated.View style={{ backgroundColor: 'white', elevation: headerElevation }}>
          <CustomHeaderBar
            navigation={navigation}
            scene={{
              descriptor: {
                options: {
                  title: 'Actus',
                  home: true,
                  headerStyle: { elevation: 0 },
                  actions: [
                    {
                      icon: 'magnify',
                      onPress: () =>
                        navigation.navigate('Main', {
                          screen: 'Search',
                          params: {
                            screen: 'Search',
                            params: { initialCategory: 'Article', previous: 'Actus' },
                          },
                        }),
                    },
                  ],
                  overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
                },
              },
            }}
          />
        </Animated.View>
      ) : (
        <TranslucentStatusBar />
      )}
      {state.loading.initial && <ProgressBar indeterminate />}
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        data={articles}
        refreshing={state.loading.refresh}
        onRefresh={() => updateArticles('refresh')}
        onEndReached={() => updateArticles('next')}
        onEndReachedThreshold={0.5}
        keyExtractor={(article) => article._id}
        ListFooterComponent={
          <View style={[styles.container, { height: 50 }]}>
            {state.loading.next && <ActivityIndicator size="large" color={colors.primary} />}
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
                      previous: 'Actus',
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
    refreshing: PropTypes.bool,
    success: PropTypes.bool,
    loading: PropTypes.shape({
      next: PropTypes.bool,
      initial: PropTypes.bool,
      refresh: PropTypes.bool,
    }),
    nextLoading: PropTypes.bool,
  }).isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
