import React from 'react';
import PropTypes from 'prop-types';
import { View, Animated } from 'react-native';
import { Button, FAB, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { PetitionCard, AnimatingHeader } from '@components/index';
import getStyles from '@styles/Styles';

function PetitionList({ navigation, petitions }) {
  const theme = useTheme();
  const { colors } = theme;

  const scrollY = new Animated.Value(0);
  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      <AnimatingHeader
        home
        value={scrollY}
        title="Pétitions"
        actions={[
          {
            icon: 'magnify',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Search',
                params: {
                  screen: 'Search',
                  params: { initialCategory: 'petitions', previous: 'Pétitions' },
                },
              }),
          },
        ]}
        overflow={[{ title: 'Hello', onPress: () => console.log('Hello') }]}
      />
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        data={petitions}
        refreshing={false}
        onRefresh={() => console.log('Refresh: Need to make server request')}
        keyExtractor={(petition) => petition._id}
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
                      id: petition.item._id,
                      title: petition.item.title,
                      previous: 'Pétitions',
                    },
                  },
                },
              })
            }
          />
        )}
      />
      <FAB
        icon="plus"
        onPress={() =>
          navigation.navigate('Main', {
            screen: 'Add',
            params: {
              screen: 'Petition',
              params: {
                screen: 'Add',
              },
            },
          })
        }
        style={styles.bottomRightFab}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  const { petitions } = state;
  return { petitions: petitions.data, state: petitions.state };
};

export default connect(mapStateToProps)(PetitionList);

PetitionList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  petitions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      voteData: PropTypes.shape({
        type: PropTypes.string.isRequired,
        goal: PropTypes.number,
        votes: PropTypes.number,
        against: PropTypes.number,
        for: PropTypes.number,
        multiple: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            votes: PropTypes.number,
          }),
        ),
      }).isRequired,
      duration: PropTypes.shape({
        start: PropTypes.string.isRequired, // Note: need to change to instanceOf(Date) once we get axios working
        end: PropTypes.string.isRequired,
      }).isRequired,
      description: PropTypes.string,
      objective: PropTypes.string,
      votes: PropTypes.string,
    }),
  ).isRequired,
};
