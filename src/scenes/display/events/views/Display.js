import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { connect } from 'react-redux';
import moment from 'moment';

import TagFlatlist from '../../../components/Tags';
import { styles } from '../../../../styles/Styles';

function EventDisplay({ route, events }) {
  const { id } = route.params;
  const event = events.find((t) => t.eventId === id);
  const { start, end } = event.duration;

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
          <TagFlatlist item={event} />
        </View>
        <View style={styles.contentContainer}>
          <Text>{event.description}</Text>
        </View>
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
      thumbnailUrl: PropTypes.string,
      description: PropTypes.string,
      group: PropTypes.shape({
        displayName: PropTypes.string,
      }),
    }).isRequired,
  ).isRequired,
};
