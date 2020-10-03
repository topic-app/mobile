import React from 'react';
import { View, Image } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import moment from 'moment';
import shortid from 'shortid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@utils/stack';

import { EventPreload } from '@ts/types';
import { getImageUrl } from '@utils/index';
import getStyles from '@styles/Styles';

import getCardStyles from './styles/CardStyles';
import { CardBase } from '../Cards';
import TagList from '../TagList';

function buildDateString(start: string, end: string) {
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

type Props = {
  event: EventPreload;
  navigate: StackNavigationProp<any, any>['navigate'];
};

const EventCard: React.FC<Props> = ({ event, navigate }) => {
  const start = event.duration?.start; // Destructure this once duration works on the server
  const end = event.duration?.end;

  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const cardStyles = getCardStyles(theme);

  return (
    <CardBase onPress={navigate} contentContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}>
      <Card.Title title={event?.title} subtitle={buildDateString(start, end)} />
      <View style={{ paddingVertical: 5 }}>
        <TagList item={event} />
      </View>
      <Card.Content style={{ marginTop: 5, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          {event.image && (
            <Image
              source={{ uri: getImageUrl({ image: event.image, size: 'small' }) }}
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
            <Text style={cardStyles.cardDescription}>{event?.summary}</Text>
            {Array.isArray(event?.places) &&
              event.places.map((p) => (
                <View
                  key={shortid()}
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
                >
                  <Icon color={colors.icon} name="map-marker" style={cardStyles.cardDescription} />
                  <Text
                    style={[cardStyles.cardDescription, { flex: 1, paddingLeft: 4 }]}
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
};

export default EventCard;
