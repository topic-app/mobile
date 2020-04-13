import React from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';

import ArticleCard from '../components/Card';

import { CustomHeaderBar } from '../../../../components/Header';
import { updateArticles } from '../../../../redux/actions/articles';
import { styles } from '../../../../styles/Styles';

function ArticleList({ navigation, articles, state }) {
  React.useEffect(() => {
    updateArticles();
  }, []);

  const scrollY = new Animated.Value(0);

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [0, 10],
    extrapolate: 'clamp',
  });

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
                  drawer: true,
                  headerStyle: { zIndex: 1, elevation: 0 },
                  actions: [
                    {
                      icon: 'magnify',
                      onPress: () =>
                        navigation.navigate('Main', {
                          screen: 'Search',
                          params: { screen: 'Search', params: { initialCategory: 'Article' } },
                        }),
                    },
                  ],
                  overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
                },
              },
            }}
          />
        </Animated.View>
      ) : null}
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        data={articles}
        refreshing={state.refreshing}
        onRefresh={() => updateArticles()}
        keyExtractor={(article) => article._id}
        ListFooterComponent={
          <View style={styles.container}>
            <Button style={styles.text}>Retour en haut</Button>
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

export default connect(mapStateToProps)(ArticleList);

ArticleList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
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
    refreshing: PropTypes.bool.isRequired,
    success: PropTypes.bool,
  }).isRequired,
};
