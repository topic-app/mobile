import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, List, useTheme } from 'react-native-paper';
import getStyles from '@styles/Styles';
import shortid from 'shortid';
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
    <View style={styles.contentContainer}>
      {(typeof email === 'string' && email.length > 0) ?? (
        <List.Item
          left={() => <List.Icon color={colors.text} icon="email-outline" />}
          title={email}
          description="Adresse email"
        />
      )}
      {(typeof phone === 'string' && phone.length > 0) ?? (
        <List.Item
          left={() => <List.Icon color={colors.text} icon="phone" />}
          title={phone}
          description="Numéro de téléphone"
        />
      )}
      {Array.isArray(other) &&
        other.map(({ value, key }) => {
          if (value && key) {
            return (
              <List.Item
                key={shortid()}
                left={() => <List.Icon color={colors.text} icon="bookmark-outline" />}
                title={value}
                description={key}
              />
            );
          }
          return null;
        })}
      {Array.isArray(event?.members) &&
        event.members.map((m) => {
          if (m?.displayName) {
            return (
              <List.Item
                key={shortid()}
                left={() => <List.Icon color={colors.text} icon="account-outline" />}
                title={m?.displayName}
                description="Organisateur"
              />
            );
          }
          return null;
        })}
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
