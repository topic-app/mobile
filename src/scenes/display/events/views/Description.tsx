import moment from 'moment';
import React from 'react';
import { View, FlatList, ActivityIndicator, Platform } from 'react-native';
import { Text, Divider, List, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import shortid from 'shortid';

import {
  CategoryTitle,
  Content,
  InlineCard,
  Illustration,
  ErrorMessage,
  CollapsibleView,
  PlatformTouchable,
} from '@components/index';
import { Permissions } from '@constants';
import { updateComments } from '@redux/actions/api/comments';
import getStyles from '@styles/Styles';
import {
  State,
  Account,
  Event,
  EventPlace,
  Duration,
  EventRequestState,
  CommentRequestState,
  Comment,
} from '@ts/types';
import { useTheme, logger, checkPermission } from '@utils/index';

import CommentInlineCard from '../../components/Comment';
import MessageInlineCard from '../components/Message';
import getEventStyles from '../styles/Styles';

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
  const eventStyles = getEventStyles(theme);
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

  if (!Array.isArray(event?.program)) {
    logger.warn('Invalid Program for event');
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
              onPress={() => logger.warn('location press not implemented', place._id)}
            />
          );
        })}

      <InlineCard
        icon="calendar"
        title={dateString}
        subtitle={timeString}
        onPress={() => logger.warn('time pressed, switch to program')}
      />
      <Divider />
      <View style={[eventStyles.description, { marginBottom: 20 }]}>
        <Content
          parser={event?.description?.parser || 'plaintext'}
          data={event?.description?.data}
        />
      </View>
      <Divider />
      {Array.isArray(event?.messages) && event.messages.length > 0 && (
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
        scope: { groups: [event?.group?._id] },
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
        title={event.group?.name || event.group?.displayName}
        subtitle={`${event.group?.shortName || ''}${event.group.shortName ? ' - ' : ''}Groupe ${
          event.group?.type
        }`}
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
            ? 'account-heart'
            : undefined
        }
        badgeColor={colors.valid}
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
                titleStyle={eventStyles.placeholder}
                right={() => <List.Icon icon="comment-plus" color={colors.icon} />}
                onPress={() => setCommentModalVisible(true)}
              />
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <Text style={eventStyles.disabledText}>
                Connectez vous pour écrire un commentaire
              </Text>
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
                <Text style={eventStyles.disabledText}> ou </Text>
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
            {reqState.comments.list.error && (
              <ErrorMessage
                type="axios"
                strings={{
                  what: 'la récupération des commentaires',
                  contentPlural: 'des commentaires',
                }}
                error={reqState.comments.list.error}
                retry={() => updateComments('initial', { parentId: event._id })}
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
  id: string;
};

function EventDisplayDescription({
  event,
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
  id,
}: EventDisplayDescriptionProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const articleComments = comments.filter((c) => c.parent === event?._id);

  React.useEffect(() => {
    updateComments('initial', { parentId: id });
  }, [null]);

  return (
    <FlatList
      ListHeaderComponent={() =>
        event ? (
          <EventDisplayDescriptionHeader
            setMessageModalVisible={setMessageModalVisible}
            event={event}
            account={account}
            navigation={navigation}
            verification={verification}
            setCommentModalVisible={setCommentModalVisible}
            reqState={reqState}
            commentsDisplayed={commentsDisplayed}
          />
        ) : null
      }
      data={reqState.events.info.success && !verification ? articleComments : []}
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
          report={(commentId) => {
            setFocusedComment(commentId);
            setCommentReportModalVisible(true);
          }}
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
    comments: comments.data,
    reqState: { events: events.state, comments: comments.state },
  };
};

export default connect(mapStateToProps)(EventDisplayDescription);
