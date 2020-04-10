import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { connect } from 'react-redux';

import TagFlatlist from '../../../components/Tags';
import { styles } from '../../../../styles/Styles';

import { fetchArticle } from '../../../../redux/actions/articles';
import Content from '../../../components/Content';

function ArticleDisplayScreen({ route, articles }) {
  const { id } = route.params;
  React.useEffect(() => {
    console.log('componentDidMount display');
    fetchArticle(id);
  }, []);

  const article = articles.find((t) => t.articleId === id);

  return (
    <View style={styles.page}>
      <ScrollView>
        {article.imageUrl ? (
          <Image source={{ uri: article.imageUrl }} style={[styles.image, { height: 250 }]} />
        ) : null}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.subtitle}>
            {article.date} par {/*article.group.displayName*/ article.content}
          </Text>
        </View>
        <TagFlatlist item={article} />
        <View style={styles.contentContainer}>
          <Content data={article.content.data} parser={article.content.parser} />
        </View>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { articles } = state;
  console.log(articles)
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
