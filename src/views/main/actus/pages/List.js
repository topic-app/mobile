import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { Button } from 'react-native-paper';

import ActuComponentListCard from '../components/listCard';

import data from '../data/testDataList.json';
import { styles } from '../../../../styles/Styles';

function ActuListScreen({ navigation }) {
  return (
    <View style={styles.page}>
      <FlatList
        data={data}
        refreshing={false}
        onRefresh={() => console.log('Refresh')}
        keyExtractor={(article) => article.articleId}
        ListFooterComponent={(
          <View style={styles.container}>
            <Button style={styles.text}>Retour en haut</Button>
          </View>
        )}
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

export default ActuListScreen;

ActuListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
