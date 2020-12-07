// @ts-nocheck

import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import shortid from 'shortid';

import populateEvents from './packer';

const LEFT_MARGIN = 60 - 1;
// const RIGHT_MARGIN = 10
const CALENDER_HEIGHT = 2400;
// const EVENT_TITLE_HEIGHT = 15
const TEXT_LINE_HEIGHT = 17;
// const MIN_EVENT_TITLE_WIDTH = 20
// const EVENT_PADDING_LEFT = 4

function range(from, to) {
  return Array.from(Array(to), (item, i) => from + i);
}

function DayView({
  start,
  end,
  events,
  width,
  styles,
  scrollToFirst,
  format24h,
  eventTapped,
  renderEvent,
}) {
  const scrollViewRef = React.createRef();

  const calendarHeight = (end - start) * 100;
  const initWidth = width - LEFT_MARGIN;
  const initPackedEvents = populateEvents(events, initWidth, start);
  let initPosition = _.min(_.map(initPackedEvents, 'top')) - calendarHeight / (end - start);
  initPosition = initPosition < 0 ? 0 : initPosition;

  const [packedEvents, setPackedEvents] = React.useState(initPackedEvents);
  const [timeNow, setTimeNow] = React.useState(moment());

  React.useEffect(() => {
    const newWidth = width - LEFT_MARGIN;
    setPackedEvents(populateEvents(events, newWidth, start));
  }, [width]);

  React.useEffect(() => {
    if (scrollToFirst) {
      if (initPosition && scrollViewRef && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: 0,
          y: initPosition,
          animated: true,
        });
      }
    }
    const interval = setInterval(() => {
      // Rerender component ever 60 seconds to update red line
      setTimeNow(moment());
    }, 60000);
    // Clears the interval on unmount
    return () => clearInterval(interval);
  }, []);

  const renderRedLine = () => {
    const offset = 100;
    return (
      <View
        key="timeNow"
        style={[
          styles.lineNow,
          {
            top: offset * (timeNow.hour() - start) + (offset * timeNow.minutes()) / 60,
            width: width - 20,
          },
        ]}
      />
    );
  };

  const renderLines = () => {
    const offset = calendarHeight / (end - start);

    return range(start, end + 1).map((i, index) => {
      let timeText;
      if (i === start) {
        timeText = '';
      } else if (i < 12) {
        timeText = !format24h ? `${i} AM` : i;
      } else if (i === 12) {
        timeText = !format24h ? `${i} PM` : i;
      } else if (i === 24) {
        timeText = !format24h ? '12 AM' : 0;
      } else {
        timeText = !format24h ? `${i - 12} PM` : i;
      }

      return [
        <Text key={`timeLabel${i}`} style={[styles.timeLabel, { top: offset * index - 6 }]}>
          {timeText}
        </Text>,
        i === start ? null : (
          <View
            key={`line${i}`}
            style={[styles.line, { top: offset * index, width: width - 20 }]}
          />
        ),
        <View
          key={`lineHalf${i}`}
          style={[styles.line, { top: offset * (index + 0.5), width: width - 20 }]}
        />,
      ];
    });
  };

  const renderTimeLabels = () => {
    const offset = calendarHeight / (end - start);
    return range(start, end).map((item, i) => {
      return <View key={`line${shortid()}`} style={[styles.line, { top: offset * i }]} />;
    });
  };

  const renderEvents = () => {
    const newEvents = packedEvents.map((event, i) => {
      const style = {
        left: event.left,
        height: event.height,
        width: event.width,
        top: event.top,
      };

      const eventColor = {
        backgroundColor: event.color,
      };

      // Fixing the number of lines for the event title makes this calculation easier.
      // However it would make sense to overflow the title to a new line if needed
      const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
      const formatTime = format24h ? 'HH:mm' : 'hh:mm A';
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={eventTapped && (() => eventTapped(events[event.index]))}
          key={shortid()}
          style={[styles.event, style, event.color && eventColor]}
        >
          {renderEvent ? (
            renderEvent(event)
          ) : (
            <View>
              <Text numberOfLines={2} style={styles.eventTitle}>
                {event.title || 'Évènement'}
              </Text>
              {numberOfLines > 2 && (
                <View>
                  <Text style={styles.eventTimes} numberOfLines={1}>
                    <Icon name="clock" />
                    {moment(event.start).format(formatTime)}
                    <Icon name="chevron-right" />
                    {moment(event.end).format(formatTime)}
                  </Text>
                  {event.address?.shortName ? (
                    <Text style={styles.eventTimes} numberOfLines={1}>
                      {event.address?.shortName}
                    </Text>
                  ) : null}
                </View>
              )}
              {numberOfLines > 1 && (
                <Text numberOfLines={numberOfLines - 1} style={[styles.eventSummary]}>
                  {event.summary || ' '}
                </Text>
              )}
              {/* event.summary && <Text style={{ color: colors.disabled }}>{event.summary}</Text> */}
            </View>
          )}
        </TouchableOpacity>
      );
    });

    return (
      <View>
        <View style={{ marginLeft: LEFT_MARGIN }}>{newEvents}</View>
      </View>
    );
  };

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={[styles.contentStyle, { width }]}>
      {renderLines()}
      {renderEvents()}
      {renderRedLine()}
    </ScrollView>
  );
}

export default React.memo(DayView);

DayView.propTypes = {
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string,
    }),
  ).isRequired,
  width: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object.isRequired,
  scrollToFirst: PropTypes.bool,
  format24h: PropTypes.bool,
  eventTapped: PropTypes.func,
  renderEvent: PropTypes.elementType,
};

DayView.defaultProps = {
  scrollToFirst: true,
  format24h: true,
  eventTapped: null,
  renderEvent: null,
};
