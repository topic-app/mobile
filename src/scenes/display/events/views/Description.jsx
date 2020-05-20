import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, List, Divider, useTheme } from 'react-native-paper';
import getStyles from '@styles/Styles';
import Content from '@components/Content';
import moment from 'moment';
import shortid from 'shortid';
import getEventStyles from '../styles/Styles';

function getPlaceLabels(place) {
  const { type, address, associatedSchool, associatedPlace } = place;
  switch (type) {
    case 'standalone': {
      const { number, street, extra, city } = address.address;
      return {
        title: address.shortName || `${number}, ${street} ${extra}`,
        description: city,
      };
    }
    case 'school': {
      const { number, street, extra, city } = associatedSchool.address.address;
      return {
        title: associatedSchool.displayName,
        description: `${
          associatedSchool.address.shortName || `${number}, ${street} ${extra}`
        }, ${city}`,
      };
    }
    case 'place': {
      const { number, street, extra, city } = associatedPlace.address.address;
      return {
        title: associatedPlace.displayName,
        description: `${
          associatedPlace.address.shortName || `${number}, ${street} ${extra}`
        }, ${city}`,
      };
    }
    default:
      return {
        title: 'Inconnu',
        description: 'Endroit non spécifié',
      };
  }
}

function getTimeLabels(timeData, startTime, endTime) {
  console.log(timeData);
  if (timeData?.start && timeData?.end) {
    return {
      dateString: `Du ${moment(timeData.start).format('DD/MM/YYYY')} au ${moment(
        timeData.end,
      ).format('DD/MM/YYYY')}`,
      timeString:
        startTime && endTime
          ? `De ${startTime} à ${endTime}`
          : `De ${moment(timeData.start).hour()}h à ${moment(timeData.end).hour()}h`,
    };
  }
  return {
    dateString: 'Date Invalide',
    timeString: 'Aucune date spécifiée',
  };
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function EventDisplayDescription({ event }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const eventStyles = getEventStyles(theme);
  const { colors } = theme;

  if (!event) {
    // Render placeholder
    return (
      <View>
        <Text>En attente du server</Text>
      </View>
    );
  }

  if (!(Array.isArray(event?.program) && event?.program?.length > 0)) {
    console.log('Invalid Program!');
    // Handle invalid program
  }

  // Note: using optional chaining is very risky with moment, if a property is undefined the whole
  // equality becomes undefined and moment then refers to current time, which completely falsifies hours
  const startTime = Math.min(
    ...(event?.program?.map((e) => e.duration.start && moment(e.duration.start).hour()) || []),
  );
  const endTime = Math.max(
    ...(event?.program?.map((e) => e.duration.end && moment(e.duration.end).hour()) || []),
  );

  const { timeString, dateString } = getTimeLabels(event?.duration, startTime, endTime);

  return (
    <View style={styles.contentContainer}>
      {Array.isArray(event?.places) &&
        event.places.map((place) => {
          const { title, description } = getPlaceLabels(place);
          return (
            <List.Item
              key={shortid()}
              left={() => <List.Icon color={colors.text} icon="map-marker" />}
              title={title}
              description={description}
            />
          );
        })}

      <List.Item
        left={() => <List.Icon color={colors.text} icon="calendar" />}
        title={dateString}
        description={timeString}
      />
      <List.Item
        left={() => <List.Icon color={colors.text} icon="school" />}
        title={event?.group?.displayName}
        description={`Groupe ${capitalize(event?.group?.type)}`}
      />
      <Divider />
      <View style={eventStyles.description}>
        <Content
          parser={event?.description?.parser || 'plaintext'}
          data={event?.description?.data}
        />
      </View>
    </View>
  );
}

export default EventDisplayDescription;

EventDisplayDescription.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
    description: PropTypes.shape({
      parser: PropTypes.oneOf(['plaintext', 'markdown']).isRequired,
      data: PropTypes.string.isRequired,
    }).isRequired,
    group: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }).isRequired,
    places: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        address: PropTypes.shape({
          shortName: PropTypes.string,
          address: PropTypes.string,
          city: PropTypes.string,
        }),
        associatedSchool: PropTypes.shape({
          displayName: PropTypes.string,
        }),
        associatedPlace: PropTypes.shape({
          displayName: PropTypes.string,
        }),
      }),
    ),
  }).isRequired,
};
