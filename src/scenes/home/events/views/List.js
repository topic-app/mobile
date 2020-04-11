import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-native-paper';
import { View, FlatList } from 'react-native';
import { styles } from '../../../../styles/Styles';
import EventCard from '../components/Card';

function EventList({ navigation, events }) {
  return (
    <View style={styles.page}>
      <FlatList
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
              navigation.navigate('EventDisplay', {
                id: event.item.eventId,
                title: event.item.title,
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
