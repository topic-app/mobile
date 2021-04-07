import moment from 'moment';
import React from 'react';
import { View, FlatList, ActivityIndicator, Platform, Clipboard } from 'react-native';
import { Text, Divider, List, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import shortid from 'shortid';

import {
  CategoryTitle,
  Content,
  InlineCard,
  Illustration,
  ErrorMessage,
  PlatformTouchable,
} from '@components';
import { updateComments } from '@redux/actions/api/comments';
import { fetchEventMy } from '@redux/actions/api/events';
import { eventLike } from '@redux/actions/apiActions/events';
import {
  State,
  Account,
  Event,
  EventPlace,
  Duration,
  EventRequestState,
  CommentRequestState,
  Comment,
  EventMyInfo,
} from '@ts/types';
import { logger, checkPermission, Errors, shareContent, handleUrl, Permissions } from '@utils';

import CommentInlineCard from '../components/Comment';
import MessageInlineCard from './components/Message';
import getStyles from './styles';

function getPlaceLabels(place: EventPlace) {
  switch (place.type) {
    case 'standalone': {
      const { address } = place;
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
      const { associatedSchool } = place;
      if (!associatedSchool?.address?.address) {
        return { title: '', description: '' };
      }
      const { number, street, extra, city } = associatedSchool.address.address;
      return {
        title: associatedSchool.name,
        description: `${
          associatedSchool.address.shortName || `${number}, ${street} ${extra}`
        }, ${city}`,
      };
    }
    case 'place': {
      const { associatedPlace } = place;
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
    case 'online':
      return {
        title: 'Évènement en ligne',
        description: place.link
          ?.replace('http://', '')
          ?.replace('https://', '')
          ?.split(/[/?#]/)?.[0],
        icon: 'link',
        onPress: () => handleUrl(place.link),
        onCopy: () => Clipboard.setString(place.link),
      };
    default:
      return {
        title: 'Inconnu',
        description: 'Endroit non spécifié',
      };
  }
}

function getTimeLabels(timeData: Duration, startTime: number | null, endTime: number | null) {
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

type CombinedReqState = {
  events: EventRequestState;
  comments: CommentRequestState;
};

type EventDisplayHeaderProps = {
  event: Event;
  eventMy: EventMyInfo | null;
  navigation: any;
  account: Account;
  verification: boolean;
  commentsDisplayed: boolean;
  setCommentModalVisible: (state: boolean) => any;
  reqState: CombinedReqState;
  setMessageModalVisible: (state: boolean) => any;
};

function EventDisplayDescriptionHeader({
  event,
  eventMy,
  navigation,
  account,
  verification,
  reqState,
  setCommentModalVisible,
  setMessageModalVisible,
  commentsDisplayed,
}: EventDisplayHeaderProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [messagesShown, setMessagesShown] = React.useState(false);

  if (!event) {
    // Render placeholder
    return (
      <View>
        <Text>En attente du serveur</Text>
      </View>
    );
  }

  if (!Array.isArray(event.program)) {
    logger.warn('Invalid Program for event');
    // Handle invalid program
  }

  // Note: using optional chaining is very risky with moment, if a property is undefined the whole
  // equality becomes undefined and moment then refers to current time, which is not at all what we want
  let startTime = null;
  let endTime = null;
  if (event.duration?.start && event.duration?.end) {
    startTime = moment(event.duration.start).hour();
    endTime = moment(event.duration.end).hour();
  }

  const { timeString, dateString } = getTimeLabels(event.duration, startTime, endTime);

  const likeEvent = () => {
    eventLike(event._id, !eventMy?.liked)
      .then(() => {
        fetchEventMy(event._id);
      })
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: 'la prise en compte du like',
          error,
          retry: () => likeEvent(),
        }),
      );
  };

  return (
    <View>
      {Array.isArray(event.places) &&
        event.places.map((place) => {
          const { title, description, icon = 'map-marker', onPress, onCopy } = getPlaceLabels(
            place,
          );
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <InlineCard
                  key={shortid()}
                  icon={icon}
                  title={title}
                  subtitle={description}
                  onPress={onPress}
                />
              </View>
              {onCopy && (
                <View style={{ alignSelf: 'center', marginRight: 20 }}>
                  <PlatformTouchable onPress={onCopy}>
                    <Icon name="content-copy" size={24} color={colors.text} />
                  </PlatformTouchable>
                </View>
              )}
            </View>
          );
        })}

      <InlineCard icon="calendar" title={dateString} subtitle={timeString} />
      <Divider />
      <View style={[styles.description, { marginBottom: 20 }]}>
        <Content parser={event.description?.parser || 'plaintext'} data={event.description?.data} />
      </View>
      {!verification && (
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
            marginHorizontal: 10,
            justifyContent: 'space-around',
          }}
        >
          <Button
            mode="text"
            icon={eventMy?.liked ? 'thumb-up' : 'thumb-up-outline'}
            loading={reqState.events.my?.loading || reqState.events.like?.loading}
            style={{ flex: 1, marginRight: 5 }}
            color={eventMy?.liked ? colors.primary : colors.muted}
            onPress={account.loggedIn ? likeEvent : undefined}
          >
            {typeof event.cache?.likes === 'number'
              ? event.cache.likes + (eventMy?.liked ? 1 : 0)
              : ''}{' '}
            Likes
          </Button>
          <Button
            mode="text"
            icon="share-variant"
            style={{ flex: 1, marginLeft: 5 }}
            color={colors.muted}
            onPress={() => {
              shareContent({
                title: `Évènement ${event.title}`,
                group: event.group?.displayName,
                type: 'evenements',
                id: event._id,
              });
            }}
          >
            Partager
          </Button>
        </View>
      )}
      <Divider />
      {Array.isArray(event.messages) && event.messages.length > 0 && (
        <View>
          <View style={styles.container}>
            <CategoryTitle>Messages</CategoryTitle>
          </View>
          {(!messagesShown ? event.messages.slice(0, 3) : event.messages).map((m) => (
            <View key={m._id}>
              <MessageInlineCard message={m} isPublisher={m?.group?._id === event.group?._id} />
            </View>
          ))}
          {event.messages.length > 3 && (
            <View>
              <PlatformTouchable onPress={() => setMessagesShown(!messagesShown)}>
                <View style={{ flexDirection: 'row', margin: 10, alignSelf: 'center' }}>
                  <Text style={{ color: colors.disabled, alignSelf: 'center' }}>
                    Voir {messagesShown ? 'moins' : 'plus'} de messages
                  </Text>
                  <Icon
                    name={!messagesShown ? 'chevron-down' : 'chevron-up'}
                    color={colors.disabled}
                    size={23}
                  />
                </View>
              </PlatformTouchable>
            </View>
          )}
        </View>
      )}
      {checkPermission(account, {
        permission: Permissions.EVENT_MESSAGES_ADD,
        scope: { groups: [event.group?._id] },
      }) && (
        <View style={styles.container}>
          <Button
            icon="message-processing"
            mode={Platform.OS === 'ios' ? 'text' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => setMessageModalVisible(true)}
          >
            Envoyer un message
          </Button>
        </View>
      )}
      <Divider />

      <View style={styles.container}>
        <CategoryTitle>Auteur{event.authors?.length > 1 ? 's' : ''}</CategoryTitle>
      </View>
      {event.authors?.map((author) => (
        <InlineCard
          avatar={author.info?.avatar}
          title={author?.displayName}
          subtitle={
            author.displayName === author.info?.username ? undefined : `@${author.info?.username}`
          }
          onPress={() =>
            navigation.push('Root', {
              screen: 'Main',
              params: {
                screen: 'Display',
                params: {
                  screen: 'User',
                  params: {
                    screen: 'Display',
                    params: { id: author?._id, title: author?.displayName },
                  },
                },
              },
            })
          }
          badge={
            account.loggedIn &&
            account.accountInfo?.user?.data?.following?.users?.some((u) => u?._id === author?._id)
              ? 'heart'
              : undefined
          }
          badgeColor={colors.primary}
          // TODO: Add imageUrl: imageUrl={article.author.imageUrl}
          // also need to add subtitle with username/handle: subtitle={article.author.username or .handle}
        />
      ))}

      <View style={styles.container}>
        <CategoryTitle>Groupe</CategoryTitle>
      </View>
      <InlineCard
        avatar={event.group?.avatar}
        title={event.group?.name || event.group?.displayName}
        subtitle={`Groupe ${event.group?.type}`}
        onPress={() =>
          navigation.push('Root', {
            screen: 'Main',
            params: {
              screen: 'Display',
              params: {
                screen: 'Group',
                params: {
                  screen: 'Display',
                  params: { id: event.group?._id, title: event.group?.displayName },
                },
              },
            },
          })
        }
        badge={
          account.loggedIn &&
          account.accountInfo?.user?.data?.following?.groups?.some(
            (g) => g?._id === event.group?._id,
          )
            ? 'heart'
            : event.group?.official
            ? 'check-decagram'
            : undefined
        }
        badgeColor={colors.primary}
      />
      {!verification && commentsDisplayed && (
        <View>
          <View style={styles.container}>
            <CategoryTitle>Commentaires</CategoryTitle>
          </View>
          <Divider />
          {account.loggedIn ? (
            <View>
              <List.Item
                title="Écrire un commentaire"
                titleStyle={styles.placeholder}
                right={() => <List.Icon icon="comment-plus" color={colors.icon} />}
                onPress={() => setCommentModalVisible(true)}
              />
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <Text style={styles.disabledText}>Connectez-vous pour écrire un commentaire</Text>
              <Text>
                <Text
                  onPress={() =>
                    navigation.navigate('Auth', {
                      screen: 'Login',
                    })
                  }
                  style={[styles.link, styles.primaryText]}
                >
                  Se connecter
                </Text>
                <Text style={styles.disabledText}> ou </Text>
                <Text
                  onPress={() =>
                    navigation.navigate('Auth', {
                      screen: 'Create',
                    })
                  }
                  style={[styles.link, styles.primaryText]}
                >
                  créér un compte
                </Text>
              </Text>
            </View>
          )}
          <Divider />
          <View>
            {(reqState.comments.list.error || reqState.events.my?.error) && (
              <ErrorMessage
                type="axios"
                strings={{
                  what: 'la récupération des commentaires et des likes',
                  contentPlural: 'des commentaires',
                }}
                error={[reqState.comments.list.error, reqState.events.my?.error]}
                retry={() => {
                  updateComments('initial', { parentId: event._id });
                  fetchEventMy(event._id);
                }}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

type EventDisplayDescriptionProps = {
  event: Event;
  my: EventMyInfo | null;
  navigation: any;
  account: Account;
  verification: boolean;
  reqState: { events: EventRequestState; comments: CommentRequestState };
  commentsDisplayed: boolean;
  setCommentModalVisible: (state: boolean) => any;
  setFocusedComment: (id: string) => any;
  setCommentReportModalVisible: (state: boolean) => any;
  setMessageModalVisible: (state: boolean) => any;
  comments: Comment[];
  setReplyingToComment: (id: string | null) => any;
  id: string;
};

function EventDisplayDescription({
  event,
  my,
  verification,
  account,
  navigation,
  comments,
  commentsDisplayed,
  reqState,
  setFocusedComment,
  setCommentReportModalVisible,
  setMessageModalVisible,
  setCommentModalVisible,
  setReplyingToComment,
  id,
}: EventDisplayDescriptionProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const eventMy: EventMyInfo | null = my?._id === id ? my : null;

  React.useEffect(() => {
    updateComments('initial', { parentId: id });
  }, [null]);

  const eventComments = comments.filter(
    (c) =>
      c.parent === id &&
      (c.publisher?.type !== 'user' || c.publisher?.user?._id !== account.accountInfo?.accountId),
  );

  return (
    <FlatList
      ListHeaderComponent={() =>
        event ? (
          <EventDisplayDescriptionHeader
            setMessageModalVisible={setMessageModalVisible}
            event={event}
            eventMy={eventMy}
            account={account}
            navigation={navigation}
            verification={verification}
            setCommentModalVisible={setCommentModalVisible}
            reqState={reqState}
            commentsDisplayed={commentsDisplayed}
          />
        ) : null
      }
      data={
        reqState.events.info.success && !verification
          ? [...(eventMy?.comments || []), ...eventComments]
          : []
      }
      // onEndReached={() => {
      //   console.log('comment end reached');
      //   updateComments('next', { parentId: id });
      // }}
      // onEndReachedThreshold={0.5}
      keyExtractor={(comment: Comment) => comment._id}
      ItemSeparatorComponent={Divider}
      ListFooterComponent={
        reqState.events.info.success ? (
          <View>
            <Divider />
            <View style={[styles.container, { height: 50 }]}>
              {reqState.comments.list.loading.next ?? (
                <ActivityIndicator size="large" color={colors.primary} />
              )}
            </View>
          </View>
        ) : undefined
      }
      ListEmptyComponent={() =>
        reqState.comments.list.success &&
        reqState.events.info.success &&
        !verification &&
        commentsDisplayed ? (
          <View style={styles.contentContainer}>
            <View style={styles.centerIllustrationContainer}>
              <Illustration name="comment-empty" height={200} width={200} />
              <Text>Aucun commentaire</Text>
            </View>
          </View>
        ) : null
      }
      renderItem={({ item: comment }: { item: Comment }) => (
        <CommentInlineCard
          comment={comment}
          fetch={() => updateComments('initial', { parentId: id })}
          isReply={false}
          report={(commentId) => {
            setFocusedComment(commentId);
            setCommentReportModalVisible(true);
          }}
          reply={(commentId) => {
            setReplyingToComment(commentId);
            setCommentModalVisible(true);
          }}
          authors={[...(event.authors?.map((a) => a._id) || []), event.group?._id || '']}
          loggedIn={account.loggedIn}
          navigation={navigation}
        />
      )}
    />
  );
}

const mapStateToProps = (state: State) => {
  const { account, comments, events } = state;
  return {
    account,
    my: events.my,
    comments: comments.data,
    reqState: { events: events.state, comments: comments.state },
  };
};

export default connect(mapStateToProps)(EventDisplayDescription);
