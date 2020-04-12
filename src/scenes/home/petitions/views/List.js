// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';

import PetitionCard from '../components/Card';

import { CustomHeaderBar } from '../../../../components/Header';
import { styles } from '../../../../styles/Styles';

function PetitionList({ navigation, petitions }) {
  return (
    <View style={styles.page}>
      {Platform.OS !== 'ios' ? (
        <CustomHeaderBar
          navigation={navigation}
          scene={{
            descriptor: {
              options: {
                title: 'Pétitions',
                drawer: true,
                actions: [
                  {
                    icon: 'magnify',
                    onPress: () =>
                      navigation.navigate('Main', {
                        screen: 'Search',
                        params: { screen: 'Search', params: { initialCategory: 'Petition' } },
                      }),
                  },
                ],
                overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
              },
            },
          }}
        />
      ) : null}
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
              navigation.navigate('Main', {
                screen: 'Display',
                params: {
                  screen: 'Petition',
                  params: {
                    screen: 'Display',
                    params: {
                      id: petition.item.petitionId,
                    },
                  },
                },
              })
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
