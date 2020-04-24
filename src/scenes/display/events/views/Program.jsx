import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import shortid from 'shortid';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import getStyles from '@styles/Styles';
import getEventStyles from '../styles/Styles';

function EntryOneDay({ entry }) {
  const eventStyles = getEventStyles(useTheme());
  return (
    <View>
      <Text style={eventStyles.date}>
        Le {moment(entry.duration.start).format('DD/MM/YYYY')} :{' '}
      </Text>
      <Text style={eventStyles.time}>
        de {moment(entry.duration.start).format('HH:mm')} à{' '}
        {moment(entry.duration.end).format('HH:mm')} :
      </Text>
      <Text style={eventStyles.title}>{entry.title}</Text>
    </View>
  );
}

function EntryOneDayMultiple({ entries }) {
  const eventStyles = getEventStyles(useTheme());
  return (
    <View>
      <Text style={eventStyles.date}>
        Le {moment(entries[0].duration.start).format('DD/MM/YYYY')} :{' '}
      </Text>
      {entries.map((entry) => (
        <View key={shortid()}>
          <Text style={eventStyles.time}>
            de {moment(entry.duration.start).format('HH:mm')} à{' '}
            {moment(entry.duration.end).format('HH:mm')} :
          </Text>
          <Text style={eventStyles.title}>{entry.title}</Text>
        </View>
      ))}
    </View>
  );
}

function EntryMultipleDay({ entry }) {
  const eventStyles = getEventStyles(useTheme());
  return (
    <View>
      <Text style={eventStyles.date}>
        du {moment(entry.duration.start).format('DD/MM/YYYY HH:mm')} au{' '}
        {moment(entry.duration.end).format('DD/MM/YYYY HH:mm')} :
      </Text>
      <Text style={eventStyles.title}>{entry.title}</Text>
    </View>
  );
}

const happensInOneDay = (duration) => moment(duration.start).isSame(duration.end, 'day');
const isSameDay = (firstDuration, secondDuration) =>
  happensInOneDay(firstDuration) &&
  happensInOneDay(secondDuration) &&
  moment(firstDuration.start).isSame(secondDuration.start, 'day');

function EventDisplayProgram({ program }) {
  const styles = getStyles(useTheme());
  const eventStyles = getEventStyles(useTheme());

  // Make sure that program is in chronological order
  const sortedProgram = program.filter((item) => moment(item.duration.start).get('second'));

  let lastEntry = null;
  // Group the entries by date
  // e.g. [['January 1st 1pm', 'January 1st 3pm'], ['January 2nd 1pm']]
  const groupedProgram = [];
  sortedProgram.forEach((entry) => {
    if (lastEntry === null || !isSameDay(entry.duration, lastEntry.duration)) {
      groupedProgram.push([entry]);
    } else {
      groupedProgram[groupedProgram.length - 1].push(entry);
    }
    lastEntry = entry;
  });

  return (
    <View style={styles.contentContainer}>
      <Text style={eventStyles.subtitle}>Demandez le Programe :</Text>
      {groupedProgram.map((day) => {
        const key = shortid();
        if (day.length === 1) {
          if (happensInOneDay(day[0].duration)) {
            return <EntryOneDay key={key} entry={day[0]} />;
          }
          return <EntryMultipleDay key={key} entry={day[0]} />;
        }
        return <EntryOneDayMultiple key={key} entries={day} />;
      })}
    </View>
  );
}

export default EventDisplayProgram;

const entryPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  duration: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
  }).isRequired,
});

EventDisplayProgram.propTypes = {
  program: PropTypes.arrayOf(entryPropType.isRequired).isRequired,
};

EntryOneDay.propTypes = {
  entry: entryPropType.isRequired,
};

EntryOneDayMultiple.propTypes = {
  entries: PropTypes.arrayOf(entryPropType.isRequired).isRequired,
};

EntryMultipleDay.propTypes = {
  entry: entryPropType.isRequired,
};
