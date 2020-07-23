import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, List, useTheme } from 'react-native-paper';
import getStyles from '@styles/Styles';
import shortid from 'shortid';
import { InlineCard } from '@components/Cards';
import getEventStyles from '../styles/Styles';

function EventDisplayContact({ event }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const eventStyles = getEventStyles(theme);
  const { colors } = theme;

  if (!event) {
    // TODO: Better loading handling, maybe placeholders?
    return <Text>En attente du serveur</Text>;
  }

  const { email, phone, other } = event?.contact || {};

  return (
    <View>
      {email && <InlineCard icon="email-outline" title={email} subtitle="Adresse email" />}
      {phone && <InlineCard icon="phone" title={phone} subtitle="Numéro de téléphone" />}
      {other &&
        other.map(({ value, key }) => (
          <InlineCard key={shortid()} icon="bookmark-outline" title={value} subtitle={key} />
        ))}
      {event?.members &&
        event.members.map((mem) => (
          <InlineCard
            key={shortid()}
            icon="account-outline"
            title={mem.displayName}
            subtitle="Organisateur"
            onPress={() => console.log('go to user', mem._id)}
          />
        ))}
    </View>
  );
}

export default EventDisplayContact;

EventDisplayContact.propTypes = {
  event: PropTypes.shape({
    contact: PropTypes.shape({
      other: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
    members: PropTypes.arrayOf(
      PropTypes.shape({
        displayName: PropTypes.string,
      }),
    ),
  }).isRequired,
};
