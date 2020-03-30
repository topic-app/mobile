import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Avatar, Button, Card, Title } from 'react-native-paper';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import styles from '../../../../styles/Styles';
import Item from '../components/listCard';

function VirtualizedListExample({ navigation, evenements }) {
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
          <Item
            evenement={evenement.item}
            navigate={() =>
              navigation.navigate('ActuEvenement', { id: evenement.item.evenementId })
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

export default connect(mapStateToProps)(VirtualizedListExample);

VirtualizedListExample.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  evenements: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      duration: PropTypes.shape({
        start: PropTypes.instanceOf(Date).isRequired,
        end: PropTypes.instanceOf(Date).isRequired,
      }).isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
