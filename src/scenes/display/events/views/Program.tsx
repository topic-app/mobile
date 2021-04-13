import moment from 'moment';
import React from 'react';
import { View, Dimensions } from 'react-native';
import { Subheading } from 'react-native-paper';

import { Event, Image } from '@ts/types';
import { useTheme, Format, Alert } from '@utils/index';

import EventCalendar from '../components/calendar/EventCalendar';

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
    type CalendarElement = {
      id: string;
      title: string;
      image?: Image;
      address?: string;
      start: string;
      end: string;
      summary?: string;
    };

    const elements: CalendarElement[] = program.map((p) => {
      return {
        id: p._id,
        title: p.title,
        image: p.image,
        address: p.address ? Format.shortAddress(p.address) : undefined,
        start:
          typeof p.duration.start === 'string' ? p.duration.start : p.duration.start.toISOString(),
        end: typeof p.duration.end === 'string' ? p.duration.end : p.duration.end.toISOString(),
        summary: p.description?.data,
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
          eventTapped={(e: CalendarElement) => {
            if (e) {
              Alert.alert(
                e.title,
                `De ${moment(e.start).format('ddd DD MMMM hh:mm')} à ${moment(e?.end).format(
                  'ddd DD MMMM hh:mm',
                )}
                ${e.address ? `Localisation: ${e.address}` : ''}\n${
                  e.summary ? `Description: ${e.summary}` : ''
                }`,
                [{ text: 'Fermer' }],
                { cancelable: true },
              );
            }
          }}
          events={elements}
          initDate={duration?.start}
          start={startTime}
          end={endTime}
          colors={colors}
          startDay={startDay}
          endDay={endDay}
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
