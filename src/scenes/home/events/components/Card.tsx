import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { EventCard, PlatformTouchable } from '@components';
import {
  addEventRead,
  addEventToList,
  removeEventFromList,
  deleteEventReadAll,
} from '@redux/actions/contentData/events';
import { AnyEvent, EventListItem } from '@ts/types';
import { Alert } from '@utils';

import getStyles from './styles';

type EventListCardProps = {
  event: AnyEvent;
  group?: string;
  setAddToListModalEvent: (id: string) => void;
  setAddToListModalVisible: (val: boolean) => void;
  sectionKey: string;
  isRead: boolean;
  historyActive: boolean;
  lists: EventListItem[];
  navigate: () => void;
  overrideImageWidth: number;
};

const EventListCard: React.FC<EventListCardProps> = ({
  event,
  group,
  sectionKey,
  isRead,
  historyActive,
  lists,
  setAddToListModalEvent,
  setAddToListModalVisible,
  navigate,
  overrideImageWidth,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const swipeRef = React.createRef<Swipeable>();

  const maxLeftActions = (Dimensions.get('window').width - (100 + 120 * 2)) / 120;

  if (Platform.OS === 'web') {
    return <EventCard event={event} navigate={navigate} overrideImageWidth={overrideImageWidth} />;
  }

  const renderLeftActions = (id: string, title: string) => {
    return (
      <View
        style={[
          styles.container,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
        ]}
      >
        {group !== 'lists' ? (
          historyActive ? (
            <View key="read" style={{ width: 120 }}>
              <PlatformTouchable
                onPress={() => {
                  if (isRead) deleteEventReadAll(id);
                  else addEventRead(id, title, true);
                }}
              >
                <View style={{ alignItems: 'center', margin: 10 }}>
                  <Icon name={isRead ? 'eye-off' : 'eye'} color={colors.disabled} size={32} />
                  <Text style={{ color: colors.disabled, textAlign: 'center' }}>
                    Marquer {isRead ? 'non lu' : 'lu'}
                  </Text>
                </View>
              </PlatformTouchable>
            </View>
          ) : null
        ) : (
          <View key="delete" style={{ width: 120 }}>
            <PlatformTouchable
              onPress={() => {
                removeEventFromList(id, sectionKey);
              }}
            >
              <View style={{ alignItems: 'center', margin: 10 }}>
                <Icon name="delete" color={colors.disabled} size={32} />
                <Text style={{ color: colors.disabled, textAlign: 'center' }}>Retirer</Text>
              </View>
            </PlatformTouchable>
          </View>
        )}
        {lists.length === 1 && group !== 'lists' ? (
          <View key="firstlist" style={{ width: 120 }}>
            <PlatformTouchable
              onPress={() => {
                if (lists[0].items.some((i) => i._id === event._id)) {
                  Alert.alert(
                    'Voulez vous vraiment retirer cet évènement de la liste ?',
                    event.title,
                    [
                      { text: 'Annuler' },
                      {
                        text: 'Retirer',
                        onPress: () => removeEventFromList(event._id, lists[0].id),
                      },
                    ],
                    { cancelable: true },
                  );
                } else {
                  addEventToList(event._id, lists[0].id);
                }
              }}
            >
              <View style={{ alignItems: 'center', margin: 10 }}>
                <Icon
                  name={lists[0].icon}
                  color={
                    lists[0].items.some((i) => i._id === event._id)
                      ? colors.primary
                      : colors.disabled
                  }
                  size={32}
                />
                <Text
                  style={{
                    color: lists[0].items.some((i) => i._id === event._id)
                      ? colors.primary
                      : colors.disabled,
                    textAlign: 'center',
                  }}
                >
                  {lists[0].name}
                </Text>
              </View>
            </PlatformTouchable>
          </View>
        ) : (
          <View key="add" style={{ width: 120 }}>
            <PlatformTouchable
              onPress={() => {
                setAddToListModalEvent(id);
                setAddToListModalVisible(true);
              }}
            >
              <View style={{ alignItems: 'center', margin: 10 }}>
                <Icon name="playlist-plus" color={colors.disabled} size={32} />
                <Text style={{ color: colors.disabled, textAlign: 'center' }}>Sauvegarder</Text>
              </View>
            </PlatformTouchable>
          </View>
        )}
      </View>
    );
  };

  return (
    <Swipeable ref={swipeRef} renderLeftActions={() => renderLeftActions(event._id, event.title)}>
      <EventCard event={event} navigate={navigate} overrideImageWidth={overrideImageWidth} />
    </Swipeable>
  );
};

export default EventListCard;
