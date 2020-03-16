// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { 
  Button,
  Text
} from 'react-native-paper';

import PetitionComponentListCard from '../components/listCard';


import data from '../data/testDataList.json';
import { styles } from '../../../../styles/Styles';


export default class PetitionListScreen extends React.Component {
  static navigationOptions = {
    title: 'Pétitions',
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.page}>
        <FlatList
          data={data}
          refreshing={false}
          onRefresh={() => console.log('Refresh')}
          keyExtractor={(petition) => petition.petitionId}
          ListFooterComponent={(
            <View style={styles.container}>
              <Button style={styles.text}>Retour en haut</Button>
            </View>
          )}
          renderItem={(petition) => (
            <PetitionComponentListCard
              petition={petition.item}
              navigate={() => navigate('petition', { id: petition.item.petitionId })}
            />
          )}
        />
      </View>
    );
  }
}
