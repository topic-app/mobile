import React from 'react';
import { View, Platform, Animated, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ProgressBar, useTheme } from 'react-native-paper';

import { CustomHeaderBar, TranslucentStatusBar } from '@components/Header';
import { updateEvents } from '@redux/actions/api/events';
import ErrorMessage from '@components/ErrorMessage';
import getStyles from '@styles/Styles';

import EventCard from '../components/Card';

function EventList({ navigation, events, state }) {
  React.useEffect(() => {
    updateEvents('initial');
  }, []);

  const theme = useTheme();
  const { colors } = theme;

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
          {state.loading.initial && <ProgressBar indeterminate />}
          {state.error ? (
            <ErrorMessage
              type="axios"
              contentType="articles"
              error={state.error}
              retry={() => updateEvents('initial')}
            />
          ) : null}
        </Animated.View>
      ) : (
        <TranslucentStatusBar />
      )}
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        data={events}
        refreshing={state.loading.refresh}
        onRefresh={() => updateEvents('refresh')}
        onEndReached={() => updateEvents('next')}
        onEndReachedThreshold={0.5}
        keyExtractor={(event) => event._id}
        ListFooterComponent={
          <View style={[styles.container, { height: 50 }]}>
            {state.loading.next && <ActivityIndicator size="large" color={colors.primary} />}
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
                      id: event.item._id,
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
  return { events: events.data, state: events.state };
};

export default connect(mapStateToProps)(EventList);

EventList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      duration: PropTypes.shape({
        // start: PropTypes.instanceOf(Date).isRequired,
        // end: PropTypes.instanceOf(Date).isRequired,
        start: PropTypes.string,
        end: PropTypes.string,
      }).isRequired,
      description: PropTypes.shape({
        parser: PropTypes.oneOf(['markdown', 'plaintext']).isRequired,
        data: PropTypes.string.isRequired,
      }).isRequired,
      thumbnailUrl: PropTypes.string,
    }).isRequired,
  ).isRequired,
  state: PropTypes.shape({
    success: PropTypes.bool,
    loading: PropTypes.shape({
      next: PropTypes.bool,
      initial: PropTypes.bool,
      refresh: PropTypes.bool,
    }),
    error: PropTypes.shape(),
  }).isRequired,
};
