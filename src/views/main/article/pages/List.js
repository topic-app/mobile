import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';
import moment from 'moment';

import ArticleComponentListCard from '../components/listCard';
import { updateArticles } from '../../../../redux/actions/articles';

import { styles } from '../../../../styles/Styles';

function ArticleListScreen({ navigation, articles, state }) {
  React.useEffect(() => {
    updateArticles();
  }, []);

  return (
    <View style={styles.page}>
      <FlatList
        data={articles}
        refreshing={state.refreshing}
        onRefresh={() => updateArticles()}
        keyExtractor={(article) => article.articleId}
        ListFooterComponent={
          <View style={styles.container}>
            <Button style={styles.text}>Retour en haut</Button>
          </View>
        }
        renderItem={(article) => (
          <ArticleComponentListCard
            article={article.item}
            navigate={() =>
              navigation.navigate('ArticleDisplay', {
                id: article.item._id,
                title: article.item.title,
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

export default connect(mapStateToProps)(ArticleListScreen);

ArticleListScreen.propTypes = {
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
