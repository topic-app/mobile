import React from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EventCalendar from '../components/calendar/EventCalendar';

function EventEntry({ event }) {
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
}

function getLayout() {
  const { height, width } = Dimensions.get('window');
  const { top } = useSafeArea(); // Status bar height
  const headerHeight = top + 74;
  return {
    height: height - headerHeight,
    width,
  };
}

function EventDisplayProgramV2({ event }) {
  const { program, duration } = event;

  const elements = program.map((p) => {
    return {
      start: p.duration.start,
      end: p.duration.end,
      title: p.title,
      summary: p.summary || '',
    };
  });

  const startTime = Math.min(...elements.map((e) => Math.floor(moment(e.start).format('HH')))) - 1;
  const endTime = Math.max(...elements.map((e) => Math.floor(moment(e.end).format('HH')))) + 1;

  const { width, height } = getLayout();

  return (
    <View style={{ height }} onLayout={() => console.log('need to apply new width on rotation!')}>
      <EventCalendar
        width={width}
        eventTapped={(e) => console.log('Test', e)}
        events={elements}
        initDate={duration.start}
        start={startTime}
        end={endTime}
        // renderEvent={(e) => <EventEntry event={e} />}
      />
    </View>
  );
}

export default EventDisplayProgramV2;

const eventPropType = PropTypes.shape({
  program: PropTypes.arrayOf(PropTypes.shape),
  duration: PropTypes.shape({
    start: PropTypes.string,
  }),
});

EventDisplayProgramV2.propTypes = {
  event: eventPropType.isRequired,
};

EventEntry.propTypes = {
  event: eventPropType.isRequired,
};
