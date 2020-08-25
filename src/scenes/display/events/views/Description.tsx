import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, List, Divider, useTheme } from 'react-native-paper';
import getStyles from '@styles/Styles';
import Content from '@components/Content';
import moment from 'moment';
import shortid from 'shortid';
import { InlineCard } from '@components/Cards';
import getEventStyles from '../styles/Styles';

function getPlaceLabels(place) {
  console.log('>>> Place', JSON.stringify(place, null, 2));
  const { type, address, associatedSchool, associatedPlace } = place;
  switch (type) {
    case 'standalone': {
      if (!address?.address) {
        return { title: '', description: '' };
      }
      const { number, street, extra, city } = address.address;
      return {
        title: address.shortName || `${number}, ${street} ${extra}`,
        description: city,
      };
    }
    case 'school': {
      if (!associatedSchool?.address?.address) {
        return { title: '', description: '' };
      }
      const { number, street, extra, city } = associatedSchool.address.address;
      return {
        title: associatedSchool.displayName,
        description: `${
          associatedSchool.address.shortName || `${number}, ${street} ${extra}`
        }, ${city}`,
      };
    }
    case 'place': {
      if (!associatedPlace?.address?.address) {
        return { title: '', description: '' };
      }
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
  if (timeData?.start && timeData?.end) {
    return {
      dateString: `Du ${moment(timeData.start).format('DD/MM/YYYY')} au ${moment(
        timeData.end,
      ).format('DD/MM/YYYY')}`,
      timeString:
        startTime && endTime
          ? `De ${startTime}h à ${endTime}h`
          : `De ${moment(timeData.start).hour()}h à ${moment(timeData.end).hour()}h`,
    };
  }
  return {
    dateString: 'Aucune date spécifiée',
    timeString: null,
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
  // equality becomes undefined and moment then refers to current time, which is not at all what we want
  let startTime = null;
  let endTime = null;
  if (event?.duration?.start && event?.duration?.end) {
    startTime = moment(event.duration.start).hour();
    endTime = moment(event.duration.end).hour();
  }

  const { timeString, dateString } = getTimeLabels(event?.duration, startTime, endTime);

  return (
    <View>
      {Array.isArray(event?.places) &&
        event.places.map((place) => {
          const { title, description } = getPlaceLabels(place);
          return (
            <InlineCard
              key={shortid()}
              icon="map-marker"
              title={title}
              subtitle={description}
              onPress={() => console.log('location pressed', place._id)}
            />
          );
        })}

      <InlineCard
        icon="calendar"
        title={dateString}
        subtitle={timeString}
        onPress={() => console.log('time pressed, switch to program')}
      />
      <InlineCard
        icon="school"
        title={event.group.displayName}
        subtitle={event.group.type && `Groupe ${capitalize(event.group.type)}`}
        onPress={() => console.log('go to group', event.group._id)}
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
      _id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }).isRequired,
    duration: PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
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
