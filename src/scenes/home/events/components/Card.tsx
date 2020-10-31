import React from 'react';
import { View, Dimensions, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { Event, EventListItem } from '@ts/types';
import { EventCard, PlatformTouchable } from '@components/index';
import { useTheme } from '@utils/index';
import {
  addEventRead,
  deleteEventRead,
  addEventToList,
  removeEventFromList,
} from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';

import getArticleStyles from '../styles/Styles';

type EventListCardProps = {
  event: Event;
  sectionKey: string;
  itemKey: string;
  isRead: boolean;
  historyActive: boolean;
  lists: EventListItem[];
  navigate: () => void;
};

const EventListCard: React.FC<EventListCardProps> = ({
  event,
  sectionKey,
  itemKey,
  isRead,
  historyActive,
  lists,
  navigate,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const swipeRef = React.createRef<Swipeable>();

  const maxLeftActions = (Dimensions.get('window').width - 100) / 120;

  const renderRightActions = (id: string) => {
    return (
      <View style={[styles.centerIllustrationContainer, { width: '100%', alignItems: 'flex-end' }]}>
        {sectionKey !== 'lists' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}
          >
            <Text style={articleStyles.captionText}>Marquer comme {isRead ? 'non lu' : 'lu'}</Text>
            <Icon
              name={isRead ? 'eye-off' : 'eye'}
              size={32}
              style={{ marginHorizontal: 10 }}
              color={colors.disabled}
            />
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}
          >
            <Text style={articleStyles.captionText}>Retirer</Text>
            <Icon
              name="delete"
              color={colors.disabled}
              size={32}
              style={{ marginHorizontal: 10 }}
            />
          </View>
        )}
      </View>
    );
  };

  const renderLeftActions = (id: string, swipePropRef: React.RefObject<Swipeable>) => {
    return (
      <View
        style={[
          styles.container,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
        ]}
      >
        {lists.slice(0, maxLeftActions).map((l) => (
          <View key={l.id} style={{ width: 120 }}>
            <PlatformTouchable
              onPress={() => {
                if (l.items.some((i) => i._id === id)) {
                  Alert.alert(
                    `Retirer l'article de la liste ${l.name} ?`,
                    "L'article ne sera plus disponible hors-ligne",
                    [
                      { text: 'Annuler' },
                      {
                        text: 'Retirer',
                        onPress: () => removeEventFromList(id, l.id),
                      },
                    ],
                    { cancelable: true },
                  );
                } else {
                  addEventToList(id, l.id);
                }
                swipePropRef.current?.close();
              }}
            >
              <View style={{ alignItems: 'center', margin: 10 }}>
                <Icon
                  name={l.icon || 'playlist-plus'}
                  size={32}
                  color={l.items.some((i) => i._id === id) ? colors.primary : colors.disabled}
                />
                <Text
                  style={{
                    color: l.items.some((i) => i._id === id) ? colors.primary : colors.disabled,
                  }}
                >
                  {l.name}
                </Text>
              </View>
            </PlatformTouchable>
          </View>
        ))}
      </View>
    );
  };

  const swipeRightAction = (
    id: string,
    title: string,
    swipePropRef: React.RefObject<Swipeable>,
  ) => {
    swipePropRef.current?.close();
    if (sectionKey === 'lists') {
      removeEventFromList(id, itemKey);
    } else {
      if (isRead) deleteEventRead(id);
      else addEventRead(id, title, true);
    }
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={() => renderLeftActions(event._id, swipeRef)}
      renderRightActions={
        historyActive || sectionKey !== 'lists' ? () => renderRightActions(event._id) : undefined
      }
      onSwipeableRightOpen={
        historyActive || sectionKey !== 'lists'
          ? () => swipeRightAction(event._id, event.title, swipeRef)
          : undefined
      }
    >
      <EventCard unread={!isRead || itemKey !== 'all'} event={event} navigate={navigate} />
    </Swipeable>
  );
};

export default EventListCard;
