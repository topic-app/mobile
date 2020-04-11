import React from 'react';
import PropTypes from 'prop-types';
import { Text, ProgressBar } from 'react-native-paper';
import { View, ImageBackground, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import TagFlatlist from '../../../components/Tags';
import { styles } from '../../../../styles/Styles';
import { fetchArticle } from '../../../../redux/actions/articles';

import Content from '../../../components/Content';

function ArticleDisplayScreen({ route, articles }) {
  const { id } = route.params;
  let article = {};
  React.useEffect(() => {
    console.log('componentDidMount display');
    fetchArticle(id);
  }, []);

  article = articles.find((t) => t._id === id);

  if (!article) {
    // This is when article has not been loaded in list, so we have absolutely no info
    return (
      <View style={styles.page}>
        <Text>Loading</Text>
      </View>
    );
  }
  return (
    <View style={styles.page}>
      <ScrollView>
        {article.imageUrl ? (
          <ImageBackground
            source={{ uri: article.thumbnailUrl }}
            style={[styles.image, { height: 250 }]}
          >
            {article.preload && <ProgressBar indeterminate />}
          </ImageBackground>
        ) : (
          article.preload && <ProgressBar indeterminate />
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.subtitle}>
            {article.date} par {article.group.displayName}
          </Text>
        </View>
        <TagFlatlist type="article" item={article} />
        {!article.preload && (
          <View style={styles.contentContainer}>
            <Content data={article.content.data} parser={article.content.parser} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { articles } = state;
  return { articles: articles.data, state: articles.state };
};

export default connect(mapStateToProps)(ArticleDisplayScreen);

ArticleDisplayScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string,
      description: PropTypes.string,
      content: PropTypes.shape({
        parser: PropTypes.string.isRequired,
        data: PropTypes.string.isRequired,
      }).isRequired,
      group: PropTypes.shape({
        displayName: PropTypes.string,
      }),
    }).isRequired,
  ).isRequired,
};
