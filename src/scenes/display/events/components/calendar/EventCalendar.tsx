// @ts-nocheck
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { VirtualizedList, View, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import shortid from 'shortid';

import DayView from './DayView';
import getStyles from './styles';

function EventCalendar({
  start,
  end,
  startDay,
  endDay,
  colors,
  initDate,
  size,
  width,
  format24h,
  scrollToFirst,
  formatHeader,
  upperCaseHeader,
  events,
  dateChanged,
  virtualizedListProps,
  headerIconLeft,
  headerIconRight,
  renderEvent,
  eventTapped,
}) {
  const calendarRef = React.createRef();
  const styles = getStyles(useTheme(), (end - start) * 100);
  const [currentIndex, setCurrentIndex] = React.useState(size);

  const goToPage = (index) => {
    if (index <= 0 || index >= size * 2) {
      return;
    }
    const date = moment(initDate).add(index - size, 'days');
    calendarRef.current.scrollToIndex({ index, animated: false });
    setCurrentIndex(index);
  };

  const goToDate = (date) => {
    const earliestDate = moment(initDate).subtract(size, 'days');
    const index = moment(date).diff(earliestDate, 'days');
    goToPage(index);
  };

  const previous = () => {
    goToPage(currentIndex - 1);
    if (dateChanged) {
      dateChanged(
        moment(initDate)
          .add(currentIndex - 1 - size, 'days')
          .format('YYYY-MM-DD'),
      );
    }
  };

  const next = () => {
    goToPage(currentIndex + 1);
    if (dateChanged) {
      dateChanged(
        moment(initDate)
          .add(currentIndex + 1 - size, 'days')
          .format('YYYY-MM-DD'),
      );
    }
  };

  const renderItem = ({ index, item }) => {
    const date = moment(initDate).add(index - size, 'days');
    const day = date.day();

    const leftIcon = headerIconLeft || (
      <Entypo
        name="chevron-thin-left"
        style={[styles.arrow, { color: day > startDay ? colors.text : colors.disabled }]}
      />
    );
    const rightIcon = headerIconRight || (
      <Entypo
        name="chevron-thin-right"
        style={[styles.arrow, { color: day < endDay ? colors.text : colors.disabled }]}
      />
    );

    const headerText = upperCaseHeader
      ? date.format(formatHeader || 'DD MMMM YYYY').toUpperCase()
      : date.format(formatHeader || 'DD MMMM YYYY');

    return (
      <View style={[styles.container, { width }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={day > startDay ? previous : undefined}
          >
            {leftIcon}
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>{headerText}</Text>
          </View>
          <TouchableOpacity style={styles.arrowButton} onPress={day < endDay ? next : undefined}>
            {rightIcon}
          </TouchableOpacity>
        </View>
        <DayView
          date={date}
          index={index}
          format24h={format24h}
          formatHeader={formatHeader}
          renderEvent={renderEvent}
          eventTapped={eventTapped}
          events={item}
          width={width}
          styles={styles}
          scrollToFirst={scrollToFirst}
          start={start}
          end={end}
        />
      </View>
    );
  };

  const getItemLayout = (data, index) => ({ length: width, offset: width * index, index });

  const getItem = (allEvents, index) => {
    const date = moment(initDate).add(index - size, 'days');
    return _.filter(allEvents, (event) => {
      const eventStartTime = moment(event.start);
      return (
        eventStartTime >= date.clone().startOf('day') && eventStartTime <= date.clone().endOf('day')
      );
    });
  };

  return (
    <View style={[styles.container, { width }]}>
      <VirtualizedList
        ref={calendarRef}
        windowSize={2}
        initialNumToRender={2}
        initialScrollIndex={size}
        data={events}
        getItemCount={() => size * 2}
        getItem={getItem}
        keyExtractor={() => shortid()}
        getItemLayout={getItemLayout}
        horizontal
        pagingEnabled
        renderItem={renderItem}
        style={{ width }}
        scrollEnabled={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(event.nativeEvent.contentOffset.x / width);
          const date = moment(initDate).add(index - size, 'days');
          if (dateChanged) {
            dateChanged(date.format('YYYY-MM-DD'));
          }
          setCurrentIndex(index);
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...virtualizedListProps}
      />
    </View>
  );
}

export default EventCalendar;

EventCalendar.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  initDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  size: PropTypes.number,
  width: PropTypes.number,
  format24h: PropTypes.bool,
  scrollToFirst: PropTypes.bool,
  formatHeader: PropTypes.string,
  upperCaseHeader: PropTypes.bool,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      summary: PropTypes.string,
    }),
  ).isRequired,
  dateChanged: PropTypes.func,
  headerIconLeft: PropTypes.element,
  headerIconRight: PropTypes.element,
  renderEvent: PropTypes.elementType,
  eventTapped: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  virtualizedListProps: PropTypes.object,
};

EventCalendar.defaultProps = {
  width: Dimensions.get('window').width,
  start: 0,
  end: 24,
  initDate: null,
  size: 30,
  formatHeader: 'DD MMMM YYYY',
  format24h: true,
  scrollToFirst: true,
  upperCaseHeader: false,
  virtualizedListProps: {},
  dateChanged: null,
  eventTapped: null,
  headerIconLeft: null,
  headerIconRight: null,
  renderEvent: null,
};
