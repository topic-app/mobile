// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { Button } from 'react-native-paper';

import PetitionComponentListCard from '../components/listCard';

import data from '../data/testDataList.json';
import { styles } from '../../../../styles/Styles';

function PetitionListScreen({ navigation }) {
  return (
    <View style={styles.page}>
      <FlatList
        data={data}
        refreshing={false}
        onRefresh={() => console.log('Refresh: Need to make server request')}
        keyExtractor={(petition) => petition.petitionId}
        ListFooterComponent={(
          <View style={styles.container}>
            <Button style={styles.text}>Retour en haut</Button>
          </View>
        )}
        renderItem={(petition) => (
          <PetitionComponentListCard
            petition={petition.item}
            navigate={() => navigation.navigate('petition', { id: petition.item.petitionId })}
          />
        )}
      />
    </View>
  );
}

export default PetitionListScreen;

PetitionListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
