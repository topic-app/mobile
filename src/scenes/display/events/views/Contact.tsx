import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import shortid from 'shortid';
import { InlineCard } from '@components/Cards';
import { UserPreload, Event } from '@ts/types';

function EventDisplayContact({ event }: { event: Event }) {
  const theme = useTheme();
  const { colors } = theme;

  if (!event) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  const { email, phone, other } = event?.contact || {};

  return (
    <View>
      {email && <InlineCard icon="email-outline" title={email} subtitle="Adresse email" />}
      {phone && <InlineCard icon="phone" title={phone} subtitle="Numéro de téléphone" />}
      {other &&
        other.map(({ value, key }: { value: string; key: string }) => (
          <InlineCard key={shortid()} icon="bookmark-outline" title={value} subtitle={key} />
        ))}
      {event?.members &&
        event.members.map((mem: UserPreload) => (
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
