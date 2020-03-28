import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StatusBar } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';

import ActuComponentListCard from '../components/listCard';

import { styles, selectedTheme } from '../../../../styles/Styles';

function ActuListScreen({ navigation, articles }) {
  return (
    <View style={styles.page}>
      <StatusBar
        barStyle={`${selectedTheme === 'light' ? 'dark' : 'light'}-content`}
        translucent
        backgroundColor="transparent"
      />
      <FlatList
        data={articles}
        refreshing={false}
        onRefresh={() => console.log('Refresh')}
        keyExtractor={(article) => article.articleId}
        ListFooterComponent={
          <View style={styles.container}>
            <Button style={styles.text}>Retour en haut</Button>
          </View>
        }
        renderItem={(article) => (
          <ActuComponentListCard
            article={article.item}
            navigate={() => navigation.navigate('ActuArticle', { id: article.item.articleId })}
          />
        )}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  const { articles } = state;
  return { articles };
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
};
