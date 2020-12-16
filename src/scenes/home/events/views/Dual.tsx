import { RouteProp } from '@react-navigation/core';
import React from 'react';
import { View } from 'react-native';

import { FullscreenIllustration } from '@components/index';
import { useTheme } from '@utils/index';

import EventDisplay from '../../../display/events/views/Display';
import { HomeTwoNavParams, HomeTwoScreenNavigationProp } from '../../HomeTwo';
import EventList from './List';

type EventListDualProps = HomeTwoScreenNavigationProp<'Event'> & {
  route: RouteProp<HomeTwoNavParams, 'Event'>;
};

const EventListDual: React.FC<EventListDualProps> = ({ navigation, route }) => {
  const [event, setEvent] = React.useState<{
    id: string;
    title: string;
    useLists: boolean;
  } | null>(null);

  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flexGrow: 1, flex: 1 }}>
        <EventList navigation={navigation} route={route} setEvent={(e) => setEvent(e)} dual />
      </View>
      <View style={{ backgroundColor: colors.disabled, width: 1 }} />
      <View style={{ flexGrow: 2, flex: 1 }}>
        {event ? (
          <EventDisplay
            key={event.id}
            navigation={navigation}
            route={{
              key: 'EventDisplayDualPane',
              name: 'Display',
              params: {
                id: event.id,
                title: event.title,
                useLists: event.useLists,
                verification: false,
              },
            }}
            dual
          />
        ) : (
          <FullscreenIllustration illustration="event">
            Séléctionnez un évènement
          </FullscreenIllustration>
        )}
      </View>
    </View>
  );
};

export default EventListDual;
