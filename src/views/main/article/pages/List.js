import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';
import moment from 'moment';

import ActuComponentListCard from '../components/listCard';
import { updateArticles } from '../../../../redux/actions/articles';

import { styles } from '../../../../styles/Styles';

function ActuListScreen({ navigation, articles, state }) {
  React.useEffect(() => {
    updateArticles();
  }, []);

  return (
    <View style={styles.page}>
      <FlatList
        data={articles}
        refreshing={state.refreshing}
        onRefresh={() => {console.log(updateArticles());}}
        keyExtractor={(article) => article.articleId}
        ListFooterComponent={
          <View style={styles.container}>
            <Button style={styles.text}>Retour en haut</Button>
          </View>
        }
        renderItem={(article) => (
          <ActuComponentListCard
            article={article.item}
            navigate={() =>
              navigation.navigate('ArticleDisplay', {
                id: article.item.articleId,
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

export default connect(mapStateToProps)(ActuListScreen);

ActuListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string,
      description: PropTypes.string,
      content: PropTypes.shape({
        parser: PropTypes.string.isRequired,
        data: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
  state: PropTypes.shape({
    refreshing: PropTypes.bool.isRequired,
    success: PropTypes.bool,
  }).isRequired,
};
