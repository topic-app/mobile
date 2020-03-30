import PropTypes from 'prop-types';
import * as React from 'react';
import { Avatar, Button, Card, Title } from 'react-native-paper';
import { View, Text } from 'react-native';

import styles from '../../../../styles/Styles';
import Styles from '../styles/Styles';

function attente(startdate) {
  const d = new Date();
  const t = d.getTime() - startdate.getTime();
  const m = Math.floor(t / 86400000);
  return m;
}
function concatener(val) {
  if (val < 10) {
    return '0' + val;
  } else {
    return val;
  }
}
function Item({ evenement }) {
  const start = new Date(evenement.duration.start);
  const end = new Date(evenement.duration.end);

  return (
    <View style={styles.page}>
      <Card>
        <Card.Title
          title={evenement.title}
          subtitle={'J ' + attente(start)}
          left={(props) => <Avatar.Icon {...props} icon="calendar" />}
        />
        <Card.Content>
          <Title style={Styles.title}>
            du {concatener(start.getDate())}/{concatener(start.getMonth() + 1)}/
            {concatener(start.getFullYear())} aux {concatener(end.getDate())}/
            {concatener(end.getMonth() + 1)}/{concatener(end.getFullYear())}
          </Title>
          <Text style={Styles.text}>{evenement.description}</Text>
        </Card.Content>
        <Card.Cover source={{ uri: evenement.imageUrl }} />
        <Card.Actions>
          <Button>Voir</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

export default Item;

Item.propTypes = {
  evenement: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      duration: PropTypes.shape({
        start: PropTypes.instanceOf(Date).isRequired,
        end: PropTypes.instanceOf(Date).isRequired,
      }).isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  navigate: PropTypes.func.isRequired,
};
