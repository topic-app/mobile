import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, ScrollView } from 'react-native';

import TagFlatlist from '../../../components/Tags';
import { styles } from '../../../../styles/Styles';

import evenements from '../data/testDataList.json';

function EvenementDisplayScreen({ route /* evenements */ }) {
  const { id } = route.params;
  const evenement = evenements.find((t) => t.evenementId === id);

  return (
    <View style={styles.page}>
      <ScrollView>
        <Image source={{ uri: evenement.thumbnailUrl }} style={[styles.image, { height: 250 }]} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{evenement.title}</Text>
          <Text style={styles.subtitle}>
            {evenement.time} par {evenement.group.displayName}
          </Text>
        </View>
        <View>
          <TagFlatlist item={evenement} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>{evenement.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default EvenementDisplayScreen;

EvenementDisplayScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  /*
  evenements: PropTypes.arrayOf(
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
  */
};
