import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import moment from 'moment';

import TagList from '@components/TagList';
import getStyles from '@styles/Styles';
import EventDisplayProgram from './Program';

function EventDisplay({ route, events }) {
  const { id } = route.params;
  const event = events.find((t) => t._id === id);
  const { start, end } = event.duration;

  const styles = getStyles(useTheme());

  return (
    <View style={styles.page}>
      <ScrollView>
        <Image source={{ uri: event.thumbnailUrl }} style={[styles.image, { height: 250 }]} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.subtitle}>
            du {moment(start).format('DD/MM/YYYY')} aux {moment(end).format('DD/MM/YYYY')}
          </Text>
        </View>

        <View>
          <TagList type="event" item={event} />
        </View>
        <View style={styles.contentContainer}>
          <Text>{event.description}</Text>
        </View>
        <EventDisplayProgram program={event.program} />
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { events } = state;
  return { events };
};

export default connect(mapStateToProps)(EventDisplay);

EventDisplay.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      group: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
};
