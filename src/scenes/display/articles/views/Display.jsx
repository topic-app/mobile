import React from 'react';
import PropTypes from 'prop-types';
import { Text, ProgressBar, withTheme } from 'react-native-paper';
import { View, ImageBackground, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import Content from '../../../../components/Content';
import TagList from '../../../../components/TagList';
import getStyles from '../../../../styles/Styles';
import { fetchArticle } from '../../../../redux/actions/articles';

function ArticleDisplay({ route, articles, state, theme }) {
  const { id } = route.params;
  let article = {};
  React.useEffect(() => {
    fetchArticle(id);
  }, []);

  const styles = getStyles(theme);

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
            {(article.preload || state.loading.article) && <ProgressBar indeterminate />}
          </ImageBackground>
        ) : (
          (article.preload || state.loading.article) && <ProgressBar indeterminate />
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.subtitle}>
            {article.date} par {article.group.displayName}
          </Text>
        </View>
        <TagList type="article" item={article} />
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

export default connect(mapStateToProps)(withTheme(ArticleDisplay));

ArticleDisplay.propTypes = {
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
        parser: PropTypes.string,
        data: PropTypes.string,
      }),
      group: PropTypes.shape({
        displayName: PropTypes.string,
      }),
    }).isRequired,
  ).isRequired,
  state: PropTypes.shape({
    loading: PropTypes.shape({
      article: PropTypes.bool,
    }),
  }).isRequired,
  theme: PropTypes.shape({}).isRequired,
};
