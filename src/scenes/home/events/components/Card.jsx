import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, TouchableNativeFeedback, TouchableOpacity, Image } from 'react-native';
import { Text, Avatar, Card, IconButton, List, Button, withTheme } from 'react-native-paper';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import 'moment/locale/fr';

import TagList from '@components/TagList';
import getStyles from '@styles/Styles';
import getEventStyles from '../styles/Styles';

function buildDateString(start, end) {
  moment.updateLocale('fr');
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

function EventCard({ event, navigate, theme }) {
  const { start, end } = event.duration;

  const { colors } = theme;

  const styles = getStyles(theme);
  const eventStyles = getEventStyles(theme);

  const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

  return (
    <Card style={styles.card}>
      <Touchable onPress={navigate}>
        <View>
          <Card.Title
            title={event.title}
            subtitle={buildDateString(start, end)}
            left={({ size }) => <Avatar.Icon size={size} icon="calendar" />}
          />
          <Card.Content style={{ paddingVertical: 10, paddingHorizontal: 0 }}>
            <View>
              <TagList type="event" item={event} />
            </View>
          </Card.Content>
          <Card.Content style={{ marginTop: 5, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row' }}>
              {event.thumbnailUrl ? (
                <Image
                  source={{ uri: event.thumbnailUrl }}
                  style={[
                    styles.thumbnail,
                    {
                      width: 130,
                      height: 130,
                    },
                  ]}
                />
              ) : (
                <View
                  style={{
                    width: 120,
                    height: 120,
                  }}
                />
              )}
              <View
                style={{
                  margin: 10,
                  marginTop: 0,
                  marginLeft: 15,
                  flex: 1,
                }}
              >
                <Text style={eventStyles.text}>{event.summary}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <Icon color={colors.text} name="map-marker" />
                  <Text style={{ fontSize: 17 }}> {event.address}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                  <Icon color={colors.text} name="currency-eur" />
                  <Text style={{ fontSize: 17 }}> Participation gratuite</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                  <Icon color={colors.text} name="calendar" />
                  <Text style={{ fontSize: 17 }}> {moment(event.duration.start).calendar()}</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </View>
      </Touchable>
    </Card>
  );
}

export default withTheme(EventCard);

EventCard.propTypes = {
  event: PropTypes.shape({
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
  }).isRequired,
  navigate: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string,
      disabled: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
