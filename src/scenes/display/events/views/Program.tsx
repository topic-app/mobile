import moment from 'moment';
import React from 'react';
import { View, Dimensions, Alert } from 'react-native';
import { Text, Subheading } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Event } from '@ts/types';
import { useTheme, logger } from '@utils/index';

import EventCalendar from '../components/calendar/EventCalendar';

const EventEntry: React.FC<{ event: Event }> = ({ event }) => {
  const { colors } = useTheme();
  return (
    <View>
      <Text>{event.title}</Text>
      <Text>
        <Icon name="clock" />
        {moment(event.duration.start).format('HH:mm')}
        <Icon name="chevron-right" />
        {moment(event.duration.end).format('HH:mm')}
      </Text>
      {event.summary ? <Text style={{ color: colors.disabled }}>{event.summary}</Text> : null}
    </View>
  );
};

function getLayout() {
  const { height, width } = Dimensions.get('window');
  return {
    height,
    width,
  };
}

const EventDisplayProgram: React.FC<{ event: Event }> = ({ event }) => {
  const { program, duration } = event;

  const theme = useTheme();
  const { colors } = theme;

  if (Array.isArray(program) && program.length > 0) {
    const elements = program.map((p) => {
      return {
        id: p._id,
        title: p.title,
        image: p.image,
        address: p.address?.shortName,
        start: p.duration.start,
        end: p.duration.end,
        description: p.description?.data,
      };
    });

    const startTime = Math.min(...elements.map((e) => moment(e.start).hour())) - 1;
    const endTime = Math.max(...elements.map((e) => moment(e.end).hour())) + 1;

    const startDay = Math.min(...elements.map((e) => moment(e.start).day()));
    const endDay = Math.max(...elements.map((e) => moment(e.end).day()));

    let { width, height } = getLayout();

    return (
      <View
        style={{ height }}
        onLayout={() => {
          width = getLayout().width;
          height = getLayout().height;
        }}
      >
        <EventCalendar
          width={width}
          eventTapped={(e) => {
            console.log(e);
            Alert.alert(
              e?.title,
              `De ${moment(e?.start).format('ddd DD MMMM hh:mm')} à ${moment(e?.end).format(
                'ddd DD MMMM hh:mm',
              )}
              ${e?.address ? `Localisation: ${e.address}` : ''}${'\n'}${
                e?.description ? `Description: ${e.description}` : ''
              }`,
              [{ text: 'Fermer' }],
              { cancelable: true },
            );
          }}
          events={elements as any}
          initDate={duration?.start}
          start={startTime}
          end={endTime}
          colors={colors}
          startDay={startDay}
          endDay={endDay}
          // renderEvent={(e) => <EventEntry event={e} />}
        />
      </View>
    );
  }
  return (
    <View style={{ alignSelf: 'center', margin: 40 }}>
      <Subheading>Pas de programme</Subheading>
    </View>
  );
};

export default EventDisplayProgram;
