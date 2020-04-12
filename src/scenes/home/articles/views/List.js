import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Platform } from 'react-native';
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

  return (
    <View style={styles.page}>
      {Platform.OS !== 'ios' ? (
        <CustomHeaderBar
          navigation={navigation}
          scene={{
            descriptor: {
              options: {
                title: 'Actus',
                drawer: true,
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
      ) : null}
      <FlatList
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
