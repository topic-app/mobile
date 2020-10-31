import React from 'react';
import { View } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import moment from 'moment';
import shortid from 'shortid';

import { State, Account } from '@ts/types';
import { useTheme } from '@utils/index';
import { CategoryTitle, Content, InlineCard } from '@components/index';
import getStyles from '@styles/Styles';

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

type EventDisplayProps = {
  event: Event;
  navigation: any;
  account: Account;
};

function EventDisplayDescription({ event, navigation, account }: EventDisplayProps) {
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
      <Divider />
      <View style={eventStyles.description}>
        <Content
          parser={event?.description?.parser || 'plaintext'}
          data={event?.description?.data}
        />
      </View>
      <Divider />
      <View style={styles.container}>
        <CategoryTitle>Auteur{event.authors?.length > 1 ? 's' : ''}</CategoryTitle>
      </View>
      {event.authors?.map((author) => (
        <InlineCard
          avatar={author.info?.avatar}
          title={author?.displayName}
          onPress={() =>
            navigation.push('Main', {
              screen: 'Display',
              params: {
                screen: 'User',
                params: {
                  screen: 'Display',
                  params: { id: author?._id, title: author?.displayName },
                },
              },
            })
          }
          badge={
            account.loggedIn &&
            account.accountInfo?.user?.data?.following?.users.includes(author._id)
              ? 'account-heart'
              : undefined
          }
          badgeColor={colors.valid}
          // TODO: Add imageUrl: imageUrl={article.author.imageUrl}
          // also need to add subtitle with username/handle: subtitle={article.author.username or .handle}
        />
      ))}

      <View style={styles.container}>
        <CategoryTitle>Groupe</CategoryTitle>
      </View>
      <InlineCard
        avatar={event.group?.avatar}
        title={event.group?.displayName}
        subtitle={`Groupe ${event.group?.type}`}
        onPress={() =>
          navigation.push('Main', {
            screen: 'Display',
            params: {
              screen: 'Group',
              params: {
                screen: 'Display',
                params: { id: event.group?._id, title: event.group?.displayName },
              },
            },
          })
        }
        badge={
          account.loggedIn &&
          account.accountInfo?.user?.data?.following?.groups?.includes(event.group?._id)
            ? 'account-heart'
            : null
        }
        badgeColor={colors.valid}
      />
    </View>
  );
}

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account };
};

export default connect(mapStateToProps)(EventDisplayDescription);
