import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import shortid from 'shortid';

import { InlineCard } from '@components/Cards';
import { UserPreload, Event } from '@ts/types';
import { useTheme, handleUrl } from '@utils/index';

type EventDisplayContactProps = {
  event: Event;
  navigation: any;
};

const EventDisplayContact: React.FC<EventDisplayContactProps> = ({ event, navigation }) => {
  const theme = useTheme();
  const { colors } = theme;

  if (!event) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  const { email, phone, other } = event?.contact || {};

  const icons: { [key: string]: string } = {
    twitter: 'twitter',
    instagram: 'instagram',
    facebook: 'facebook',
    reddit: 'reddit',
  };

  return (
    <View>
      {email ? (
        <InlineCard
          icon="email-outline"
          title={email}
          subtitle="Adresse email"
          onPress={() => handleUrl(`mailto:${email}`)}
        />
      ) : null}
      {phone ? (
        <InlineCard
          icon="phone"
          title={phone}
          subtitle="Numéro de téléphone"
          onPress={() => handleUrl(`tel:${phone}`)}
        />
      ) : null}
      {other
        ? other.map(({ value, key, link }: { value: string; key: string; link?: string }) => (
            <InlineCard
              key={shortid()}
              icon={icons[key.toLowerCase()] || 'at'}
              title={value}
              subtitle={key}
              onPress={link ? () => handleUrl(link) : undefined}
            />
          ))
        : null}
      {event?.members
        ? event.members.map((mem: UserPreload) => (
            <InlineCard
              key={shortid()}
              icon="account-outline"
              title={mem.displayName}
              subtitle="Organisateur"
              onPress={() =>
                navigation.push('Main', {
                  screen: 'Display',
                  params: {
                    screen: 'User',
                    params: {
                      screen: 'Display',
                      params: { id: mem?._id, title: mem?.displayName },
                    },
                  },
                })
              }
            />
          ))
        : null}
    </View>
  );
};

export default EventDisplayContact;
