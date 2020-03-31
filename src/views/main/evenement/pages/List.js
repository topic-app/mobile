import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-native-paper';
import { View, FlatList } from 'react-native';
import { styles } from '../../../../styles/Styles';
import EvenementComponentListCard from '../components/listCard';

function EvenementListScreen({ navigation, evenements }) {
  return (
    <View style={styles.page}>
      <FlatList
        data={evenements}
        refreshing={false}
        onRefresh={() => console.log('Refresh')}
        keyExtractor={(evenement) => evenement.evenementId}
        ListFooterComponent={
          <View style={styles.container}>
            <Button style={styles.text}>Retour en haut</Button>
          </View>
        }
        renderItem={(evenement) => (
          <EvenementComponentListCard
            evenement={evenement.item}
            navigate={() =>
              navigation.navigate('EvenementDisplay', {
                id: evenement.item.evenementId,
                title: evenement.item.title,
              })
            }
          />
        )}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  const { evenements } = state;
  return { evenements };
};

export default connect(mapStateToProps)(EvenementListScreen);

EvenementListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  evenements: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      duration: PropTypes.shape({
        // start: PropTypes.instanceOf(Date).isRequired,
        // end: PropTypes.instanceOf(Date).isRequired,
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
      }).isRequired,
      description: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
