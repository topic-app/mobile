import { RouteProp, useFocusEffect } from '@react-navigation/core';
import React from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import { connect } from 'react-redux';

import { AnimatingHeader, Illustration } from '@components';
import { Config } from '@constants';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';
import { State } from '@ts/types';
import { useTheme } from '@utils';

import EventDisplay from '../../../display/events/views/Display';
import { HomeTwoScreenNavigationProp, HomeTwoNavParams } from '../../HomeTwo';
import EventListComponent from './ListComponent';

type EventListProps = {
  navigation: HomeTwoScreenNavigationProp<'Event'>;
  route: RouteProp<HomeTwoNavParams, 'Event'>;
  historyEnabled: boolean;
  locationSelected: boolean;
};

const EventListScreen: React.FC<EventListProps> = ({
  navigation,
  route,
  historyEnabled,
  locationSelected,
}) => {
  const [event, setEvent] = React.useState<{
    id: string;
    title: string;
    useLists: boolean;
  } | null>(null);

  const theme = useTheme();
  const deviceWidth = useWindowDimensions().width;
  const styles = getStyles(theme);
  const { colors } = theme;

  useFocusEffect(() => {
    if (!locationSelected) {
      navigation.navigate('Landing', {
        screen: 'SelectLocation',
        params: { goBack: false },
      });
    }
  });

  const scrollY = new Animated.Value(0);

  const headerOverflow = [
    {
      title: 'Catégories',
      onPress: () =>
        navigation.navigate('Main', {
          screen: 'Configure',
          params: {
            screen: 'Event',
          },
        }),
    },
    {
      title: 'Localisation',
      onPress: () =>
        navigation.navigate('Main', {
          screen: 'Params',
          params: {
            screen: 'Event',
          },
        }),
    },
  ];

  if (historyEnabled) {
    headerOverflow.push({
      title: 'Historique',
      onPress: () =>
        navigation.navigate('Main', {
          screen: 'History',
          params: {
            screen: 'Event',
          },
        }),
    });
  }

  const shouldRenderDualView = deviceWidth > Config.layout.dualMinWidth;

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flexGrow: 1, flex: 1 }}>
        <AnimatingHeader
          home
          value={scrollY}
          title="Évènements"
          actions={[
            {
              icon: 'magnify',
              onPress: () =>
                navigation.navigate('Main', {
                  screen: 'Search',
                  params: {
                    screen: 'Search',
                    params: { initialCategory: 'events' },
                  },
                }),
            },
          ]}
          overflow={headerOverflow}
        />
        <EventListComponent
          scrollY={scrollY}
          initialTabKey={route.params?.initialList}
          onEventCreatePressed={() => {
            updateEventCreationData({ editing: false, id: undefined });
            navigation.navigate('Main', {
              screen: 'Add',
              params: { screen: 'Event', params: { screen: 'Add' } },
            });
          }}
          onEventPress={
            shouldRenderDualView
              ? (eventData) => setEvent(eventData)
              : (eventData) =>
                  navigation.navigate('Main', {
                    screen: 'Display',
                    params: {
                      screen: 'Event',
                      params: { screen: 'Display', params: eventData },
                    },
                  })
          }
          onConfigurePressed={() =>
            navigation.navigate('Main', { screen: 'Configure', params: { screen: 'Event' } })
          }
        />
      </View>
      {shouldRenderDualView ? (
        <>
          <View style={{ backgroundColor: colors.disabled, width: 1 }} />
          <View style={{ flexGrow: 2, flex: 1 }}>
            {event ? (
              <EventDisplay
                key={event.id}
                navigation={navigation}
                route={{
                  key: 'EventDisplayDualPane',
                  name: 'Display',
                  params: {
                    id: event.id,
                    title: event.title,
                    useLists: event.useLists,
                    verification: false,
                  },
                }}
                dual
              />
            ) : (
              <View style={styles.centerIllustrationContainer}>
                <Illustration name="event" width={500} height={500} />
                <Subheading>Séléctionnez un évènement</Subheading>
              </View>
            )}
          </View>
        </>
      ) : null}
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences, location } = state;

  return { historyEnabled: preferences.history, locationSelected: location.selected };
};

export default connect(mapStateToProps)(EventListScreen);
