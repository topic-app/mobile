import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { EventCard, PlatformTouchable } from '@components';
import { addEventRead, deleteEventReadAll } from '@redux/actions/contentData/events';
import { AnyEvent } from '@ts/types';
import { Alert } from '@utils';

import getStyles from './styles';

type EventListCardProps = {
  event: AnyEvent;
  sectionKey: string;
  isRead: boolean;
  historyActive: boolean;
  navigate: () => void;
  overrideImageWidth?: number;
};

const EventListCard: React.FC<EventListCardProps> = ({
  event,
  sectionKey,
  isRead,
  historyActive,
  navigate,
  overrideImageWidth,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const swipeRef = React.createRef<Swipeable>();

  if (Platform.OS === 'web') {
    return <EventCard event={event} navigate={navigate} overrideImageWidth={overrideImageWidth} />;
  }

  const renderLeftActions = () => {
    return (
      <View
        style={[
          styles.container,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: 1 },
        ]}
      >
        <Icon
          name={isRead ? 'eye-off' : 'eye'}
          color={colors.disabled}
          size={32}
          style={{ marginHorizontal: 10 }}
        />
        <Text style={{ color: colors.disabled, textAlign: 'center' }}>
          Marquer {isRead ? 'non lu' : 'lu'}
        </Text>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={renderLeftActions}
      onSwipeableLeftOpen={() => {
        if (isRead) deleteEventReadAll(event._id);
        else addEventRead(event._id, event.title, true);
      }}
    >
      <EventCard
        event={event}
        navigate={navigate}
        overrideImageWidth={overrideImageWidth}
        unread={!isRead}
      />
    </Swipeable>
  );
};

export default EventListCard;
