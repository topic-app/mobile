import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, ScrollView, ImageBackground } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import moment from 'moment';

import TagList from '@components/TagList';
import CustomTabView from '@components/CustomTabView';
import ErrorMessage from '@components/ErrorMessage';
import getStyles from '@styles/Styles';
import { fetchEvent } from '@redux/actions/api/events';
import EventDisplayProgram from './Program';
import EventDisplayDescription from './Description';
import EventDisplayContact from './Contact';

function EventDisplay({ route, events, state }) {
  const scrollViewRef = React.createRef();
  const { id } = route.params;
  React.useEffect(() => {
    fetchEvent(id);
  }, []);
  const event = events.find((t) => t._id === id);
  const start = event?.duration?.start;
  const end = event?.duration?.end;

  const styles = getStyles(useTheme());

  return (
    <View style={styles.page}>
      <ScrollView ref={scrollViewRef}>
        {state.error ? (
          <ErrorMessage
            type="axios"
            contentType="données de l'article"
            error={state.error}
            retry={() => fetchEvent(id)}
          />
        ) : null}
        {event?.imageUrl ? (
          <ImageBackground
            source={{ uri: event.thumbnailUrl }}
            style={[styles.image, { height: 250 }]}
          >
            {(event.preload || state.loading.event) && !state.error && (
              <ProgressBar indeterminate />
            )}
          </ImageBackground>
        ) : (
          (event.preload || state.loading.event) && !state.error && <ProgressBar indeterminate />
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{event?.title}</Text>
          <Text style={styles.subtitle}>
            Du {moment(start).format('DD/MM/YYYY')} au {moment(end).format('DD/MM/YYYY')}
          </Text>
        </View>
        <View>
          <View>
            <TagList type="event" item={event} />
          </View>
        </View>

        <CustomTabView
          pages={[
            {
              key: 'description',
              title: 'Description',
              component: <EventDisplayDescription event={event} />,
            },
            {
              key: 'program',
              title: 'Programme',
              component: <EventDisplayProgram event={event} />,
              onVisible: () => scrollViewRef.current.scrollToEnd({ animated: true }),
            },
            {
              key: 'contact',
              title: 'Contact',
              component: <EventDisplayContact event={event} />,
            },
          ]}
        />
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { events } = state;
  return { events: events.data, state: events.state };
};

export default connect(mapStateToProps)(EventDisplay);

EventDisplay.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  state: PropTypes.shape({
    success: PropTypes.bool,
    loading: PropTypes.shape({
      next: PropTypes.bool,
      initial: PropTypes.bool,
      refresh: PropTypes.bool,
      event: PropTypes.bool,
    }),
    error: PropTypes.shape(),
  }).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string.isRequired,
      description: PropTypes.shape({
        parser: PropTypes.oneOf(['plaintext', 'markdown']),
        data: PropTypes.string,
      }).isRequired,
      group: PropTypes.shape({
        displayName: PropTypes.string,
      }).isRequired,
    }).isRequired,
  ).isRequired,
};
