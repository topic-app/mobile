import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import TagFlatlist from '../../../components/Tags';
import { styles } from '../../../../styles/Styles';
import Content from '../../../components/Content';

function ArticleDisplayScreen({ route, articles }) {
  const { id } = route.params;
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
            {article.time} par {article.group.displayName}
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
  return { articles };
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
      time: PropTypes.string.isRequired,
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
