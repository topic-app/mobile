import React from 'react';
import { View, ScrollView, ImageBackground } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { connect } from 'react-redux';
import moment from 'moment';

import { State, EventPreload, Event, EventRequestState } from '@ts/types';
import { TagList, CustomTabView, ErrorMessage } from '@components/index';
import { fetchEvent } from '@redux/actions/api/events';
import getStyles from '@styles/Styles';

import type { EventDisplayStackParams } from '../index';
import EventDisplayProgram from './Program';
import EventDisplayDescription from './Description';
import EventDisplayContact from './Contact';

type EventDisplayProps = StackScreenProps<EventDisplayStackParams, 'Display'> & {
  events: (EventPreload | Event)[];
  reqState: EventRequestState;
};

const EventDisplay: React.FC<EventDisplayProps> = ({ route, events, reqState }) => {
  const scrollRef = React.createRef<ScrollView>();
  const { id } = route.params;
  React.useEffect(() => {
    fetchEvent(id);
  }, [id]);
  const event = events.find((t) => t._id === id);
  const { start, end } = event?.duration || {};

  const styles = getStyles(useTheme());

  return (
    <View style={styles.page}>
      <ScrollView ref={scrollRef}>
        {state.info.error ? (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération de cet évènement',
              contentSingular: "L'évènement",
            }}
            error={state.info.error}
            retry={() => fetchEvent(id)}
          />
        ) : null}
        {event?.imageUrl ? (
          <ImageBackground
            source={{ uri: event.thumbnailUrl }}
            style={[styles.image, { height: 250 }]}
          >
            {(event.preload || state.info.loading) && !state.info.error && (
              <ProgressBar indeterminate />
            )}
          </ImageBackground>
        ) : (
          (event.preload || state.info.loading) &&
          !state.info.error && <ProgressBar indeterminate />
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{event?.title}</Text>
          <Text style={styles.subtitle}>
            {start && end
              ? `Du ${moment(start).format('DD/MM/YYYY')} au ${moment(end).format('DD/MM/YYYY')}`
              : 'Aucune Date Spécifiée'}
          </Text>
        </View>
        <View>
          <View>
            <TagList item={event} />
          </View>
        </View>

        <CustomTabView
          pages={[
            {
              key: 'description',
              title: 'Description',
              component: <EventDisplayDescription event={event} />,
            },
            {
              key: 'program',
              title: 'Programme',
              component: <EventDisplayProgram event={event} />,
              onVisible: () => scrollViewRef.current?.scrollToEnd({ animated: true }),
            },
            {
              key: 'contact',
              title: 'Contact',
              component: <EventDisplayContact event={event} />,
            },
          ]}
        />
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { events } = state;
  return { events: events.data, state: events.state };
};

export default connect(mapStateToProps)(EventDisplay);
