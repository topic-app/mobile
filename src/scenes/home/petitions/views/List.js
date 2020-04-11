// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';

import PetitionCard from '../components/Card';

import { styles } from '../../../../styles/Styles';

function PetitionList({ navigation, petitions }) {
  return (
    <View style={styles.page}>
      <FlatList
        data={petitions}
        refreshing={false}
        onRefresh={() => console.log('Refresh: Need to make server request')}
        keyExtractor={(petition) => petition.petitionId}
        ListFooterComponent={
          <View style={styles.container}>
            <Button style={styles.text}>Retour en haut</Button>
          </View>
        }
        renderItem={(petition) => (
          <PetitionCard
            petition={petition.item}
            navigate={() =>
              navigation.navigate('PetitionDisplay', { id: petition.item.petitionId })
            }
          />
        )}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  const { petitions } = state;
  return { petitions };
};

export default connect(mapStateToProps)(PetitionList);

PetitionList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  petitions: PropTypes.arrayOf(PropTypes.shape() /* A faire */).isRequired,
};
