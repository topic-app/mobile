// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, Animated } from 'react-native';
import { Button, withTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import PetitionCard from '../components/Card';

import { CustomHeaderBar, TranslucentStatusBar } from '../../../../components/Header';
import getStyles from '../../../../styles/Styles';

function PetitionList({ navigation, petitions, theme }) {
  const scrollY = new Animated.Value(0);
  const styles = getStyles(theme);

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [0, 10],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.page}>
      {Platform.OS !== 'ios' ? (
        <Animated.View style={{ backgroundColor: 'white', elevation: headerElevation }}>
          <CustomHeaderBar
            navigation={navigation}
            scene={{
              descriptor: {
                options: {
                  title: 'Pétitions',
                  home: true,
                  headerStyle: { zIndex: 1, elevation: 0 },
                  actions: [
                    {
                      icon: 'magnify',
                      onPress: () =>
                        navigation.navigate('Main', {
                          screen: 'Search',
                          params: {
                            screen: 'Search',
                            params: { initialCategory: 'Petition', previous: 'Pétitions' },
                          },
                        }),
                    },
                  ],
                  overflow: [{ title: 'Hello', onPress: () => console.log('Hello') }],
                },
              },
            }}
          />
        </Animated.View>
      ) : (
        <TranslucentStatusBar />
      )}
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
    </View>
  );
}

const mapStateToProps = (state) => {
  const { petitions } = state;
  return { petitions };
};

export default connect(mapStateToProps)(withTheme(PetitionList));

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
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
