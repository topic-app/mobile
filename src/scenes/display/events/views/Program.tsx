import React from 'react';
import { View, Dimensions } from 'react-native';
import { Text, Subheading } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

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
        {moment(event.start).format('HH:mm')}
        <Icon name="chevron-right" />
        {moment(event.end).format('HH:mm')}
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
  if (Array.isArray(program) && program.length > 0) {
    const elements = program.map((p) => {
      return {
        start: p?.duration?.start,
        end: p?.duration?.end,
        title: p?.title,
        summary: p?.summary || '',
      };
    });

    const startTime =
      Math.min(...elements.map((e) => Math.floor(moment(e?.start).format('HH')))) - 1;
    const endTime = Math.max(...elements.map((e) => Math.floor(moment(e?.end).format('HH')))) + 1;

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
          eventTapped={(e) => logger.warn('Event program detail not implemented', e)}
          events={elements}
          initDate={duration?.start}
          start={startTime}
          end={endTime}
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
