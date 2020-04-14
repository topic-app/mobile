import React from 'react';
import { View, Platform, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-native-paper';

import EventCard from '../components/Card';

import { CustomHeaderBar, TranslucentStatusBar } from '../../../../components/Header';
import { styles } from '../../../../styles/Styles';

function EventList({ navigation, events }) {
  const scrollY = new Animated.Value(0);

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
                  title: 'Évènements',
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
                            params: { initialCategory: 'Event', previous: 'Évènements' },
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
        data={events}
        refreshing={false}
        onRefresh={() => console.log('Refresh')}
        keyExtractor={(event) => event.eventId}
        ListFooterComponent={
          <View style={styles.container}>
            <Button style={styles.text}>Retour en haut</Button>
          </View>
        }
        renderItem={(event) => (
          <EventCard
            event={event.item}
            navigate={() =>
              navigation.navigate('Main', {
                screen: 'Display',
                params: {
                  screen: 'Event',
                  params: {
                    screen: 'Display',
                    params: {
                      id: event.item.eventId,
                      title: event.item.title,
                      previous: 'Évènements',
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
  const { events } = state;
  return { events };
};

export default connect(mapStateToProps)(EventList);

EventList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  events: PropTypes.arrayOf(
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
