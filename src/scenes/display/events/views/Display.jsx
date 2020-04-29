import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import moment from 'moment';

import TagList from '@components/TagList';
import CustomTabView from '@components/CustomTabView';
import getStyles from '@styles/Styles';
import EventDisplayProgram from './Program';
import EventDisplayDescription from './Description';

function EventDisplay({ route, events }) {
  const scrollViewRef = React.createRef();
  const { id } = route.params;
  const event = events.find((t) => t._id === id);
  const { start, end } = event.duration;

  const styles = getStyles(useTheme());

  return (
    <View style={styles.page}>
      <ScrollView ref={scrollViewRef}>
        <Image source={{ uri: event.thumbnailUrl }} style={[styles.image, { height: 250 }]} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.subtitle}>
            du {moment(start).format('DD/MM/YYYY')} aux {moment(end).format('DD/MM/YYYY')}
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
              component: <EventDisplayDescription description={event.description} />,
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
              component: <View />,
            },
          ]}
        />
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
      description: PropTypes.shape({
        parser: PropTypes.oneOf(['plaintext', 'markdown']).isRequired,
        data: PropTypes.string.isRequired,
      }).isRequired,
      group: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
};
