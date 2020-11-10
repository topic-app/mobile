import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import shortid from 'shortid';

import { UserPreload, Event } from '@ts/types';
import { InlineCard } from '@components/Cards';
import { useTheme } from '@utils/index';

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
        ))}
    </View>
  );
};

export default EventDisplayContact;
