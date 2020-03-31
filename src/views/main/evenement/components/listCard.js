import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { Text, View } from 'react-native';
import moment from 'moment';
import 'moment/locale/fr';

import TagFlatlist from '../../../components/Tags';
import { styles, colors } from '../../../../styles/Styles';
import evenementStyles from '../styles/Styles';

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

function EvenementComponentListCard({ evenement }) {
  const startDate = new Date(evenement.duration.start);
  const endDate = new Date(evenement.duration.end);

  return (
    <Card style={styles.card}>
      <Card.Title
        title={evenement.title}
        subtitle={buildDateString(startDate, endDate)}
        left={({ size }) => <Avatar.Icon size={size} icon="calendar" />}
      />
      <Card.Content>
        <Text style={evenementStyles.text}>{evenement.summary}</Text>
      </Card.Content>
      <Card.Content style={{ paddingVertical: 10, paddingHorizontal: 0 }}>
        <View style={{ marginTop: 10 }}>
          <TagFlatlist item={evenement} />
        </View>
      </Card.Content>
      <Card.Cover source={{ uri: evenement.thumbnailUrl }} />
      <Card.Actions>
        <IconButton icon="star-outline" color={colors.disabled} />
      </Card.Actions>
    </Card>
  );
}

export default EvenementComponentListCard;

EvenementComponentListCard.propTypes = {
  evenement: PropTypes.shape({
    title: PropTypes.string.isRequired,
    duration: PropTypes.shape({
      // start: PropTypes.instanceOf(Date).isRequired,
      // end: PropTypes.instanceOf(Date).isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    }).isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};
