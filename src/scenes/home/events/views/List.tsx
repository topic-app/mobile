import React from 'react';
import { View, Animated, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ProgressBar, FAB, useTheme } from 'react-native-paper';

import AnimatingHeader from '@components/AnimatingHeader';
import { updateEvents } from '@redux/actions/api/events';
import ErrorMessage from '@components/ErrorMessage';
import getStyles from '@styles/Styles';

import { EventCard } from '@components/index';

function EventList({ navigation, events, state, account }) {
  React.useEffect(() => {
    updateEvents('initial');
  }, []);

  const theme = useTheme();
  const { colors } = theme;

  const scrollY = new Animated.Value(0);

  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      <AnimatingHeader
        home
        value={scrollY}
        title="Évènements"
        actions={[
          {
            icon: 'magnify',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Search',
                params: {
                  screen: 'Search',
                  params: { initialCategory: 'events', previous: 'Évènements' },
                },
              }),
          },
        ]}
        overflow={[{ title: 'Hello', onPress: () => console.log('Hello') }]}
      >
        {state.list.loading.initial && <ProgressBar indeterminate />}
        {state.list.error ? (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération des évènements',
              contentPlural: 'des évènements',
              contentSingular: "La liste d'évènements",
            }}
            error={state.list.error}
            retry={() => updateEvents('initial')}
          />
        ) : null}
      </AnimatingHeader>
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        data={events}
        refreshing={state.list.loading.refresh}
        onRefresh={() => updateEvents('refresh')}
        onEndReached={() => updateEvents('next')}
        onEndReachedThreshold={0.5}
        keyExtractor={(event) => event._id}
        ListHeaderComponent={<View style={{ padding: 5 }} />}
        ListFooterComponent={
          <View style={[styles.container, { height: 50 }]}>
            {state.list.loading.next && <ActivityIndicator size="large" color={colors.primary} />}
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
      {account.loggedIn && account.permissions?.some((p) => p.permission === 'event.add') && (
        <FAB
          icon="pencil"
          onPress={() =>
            navigation.navigate('Main', {
              screen: 'Add',
              params: {
                screen: 'Event',
                params: {
                  screen: 'Add',
                },
              },
            })
          }
          style={styles.bottomRightFab}
        />
      )}
    </View>
  );
}

const mapStateToProps = (state) => {
  const { events, account } = state;
  return { events: events.data, state: events.state, account };
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
    list: PropTypes.shape({
      success: PropTypes.bool,
      loading: PropTypes.shape({
        next: PropTypes.bool,
        initial: PropTypes.bool,
        refresh: PropTypes.bool,
      }),
      error: PropTypes.shape(),
    }).isRequired,
  }).isRequired,
};
