import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import { Text, Avatar, Card, useTheme } from 'react-native-paper';
import moment from 'moment';
import shortid from 'shortid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TagList from '@components/TagList';
import { CardBase } from '@components/Cards';
import getStyles from '@styles/Styles';
import getEventStyles from '../styles/Styles';

function buildDateString(start, end) {
  if (start === undefined || end === undefined) return null;
  const now = moment();
  const startDate = moment(start);
  const endDate = moment(end);

  if (now.isAfter(endDate)) {
    return `Terminé - ${endDate.fromNow()}`;
  }
  if (now.isBetween(startDate, endDate)) {
    return `En cours - fin ${endDate.fromNow()}`;
  }
  // A partir d'ici, l'évènenement est dans le passé
  if (startDate.isBefore(now.add(7, 'days'))) {
    return `Prévu - ${startDate.calendar()}`;
  }
  return `Prévu - ${startDate.calendar()} (${startDate.fromNow()})`;
}

function EventCard({ event, navigate }) {
  const { start, end } = event?.duration || {};

  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const eventStyles = getEventStyles(theme);

  return (
    <CardBase onPress={navigate} contentContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}>
      <Card.Title
        title={event?.title}
        subtitle={buildDateString(start, end)}
        left={({ size }) => <Avatar.Icon size={size} icon="calendar" />}
      />
      <View style={{ paddingVertical: 5 }}>
        <TagList item={event} />
      </View>
      <Card.Content style={{ marginTop: 5, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          {event?.thumbnailUrl && (
            <Image
              source={{ uri: event.thumbnailUrl }}
              style={[
                styles.thumbnail,
                {
                  width: 130,
                  height: 130,
                  marginRight: 15,
                },
              ]}
            />
          )}
          <View>
            <Text style={eventStyles.cardDescription}>{event?.summary}</Text>
            {Array.isArray(event?.places) &&
              event.places.map((p) => (
                <View
                  key={shortid()}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
                >
                  <Icon color={colors.icon} name="map-marker" style={eventStyles.cardDescription} />
                  <Text
                    style={[eventStyles.cardDescription, { flex: 1, paddingLeft: 4 }]}
                    numberOfLines={1}
                  >
                    {p?.type === 'standalone' &&
                      (p?.address?.shortName ||
                        `${p?.address?.address?.street}, ${p?.address?.address?.city}`)}
                    {p.type === 'school' && p?.associatedSchool?.displayName}
                    {p.type === 'standalone' && p?.associatedPlace?.displayName}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </Card.Content>
    </CardBase>
  );
}

export default EventCard;

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.shape({
      // start: PropTypes.instanceOf(Date).isRequired,
      // end: PropTypes.instanceOf(Date).isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }).isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    description: PropTypes.shape({
      parser: PropTypes.oneOf(['markdown', 'plaintext']).isRequired,
      data: PropTypes.string.isRequired,
    }).isRequired,
    summary: PropTypes.string.isRequired,
    places: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        address: PropTypes.shape({
          shortName: PropTypes.string,
          address: PropTypes.string,
          city: PropTypes.string,
        }),
        associatedSchool: PropTypes.shape({
          displayName: PropTypes.string,
        }),
        associatedPlace: PropTypes.shape({
          displayName: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};
