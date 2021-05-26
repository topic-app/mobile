import { RouteProp } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {
  View,
  ActivityIndicator,
  Animated,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Text, Title, Card, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import {
  ErrorMessage,
  TagList,
  AnimatingHeader,
  ReportModal,
  CustomTabView,
  PlatformTouchable,
  AutoHeightImage,
} from '@components';
import { updateComments } from '@redux/actions/api/comments';
import { fetchEvent, fetchEventMy, fetchEventVerification } from '@redux/actions/api/events';
import { commentAdd, commentReport } from '@redux/actions/apiActions/comments';
import {
  eventReport,
  eventVerificationApprove,
  eventDelete,
  eventMessagesAdd,
  eventDeverify,
} from '@redux/actions/apiActions/events';
import { addEventRead } from '@redux/actions/contentData/events';
import {
  State,
  CommentRequestState,
  Account,
  EventRequestState,
  Event,
  Preferences,
  EventPreload,
  Content,
  EventVerification,
} from '@ts/types';
import {
  getImageUrl,
  handleUrl,
  checkPermission,
  Alert,
  Errors,
  shareContent,
  Permissions,
} from '@utils';

import type { EventDisplayScreenNavigationProp, EventDisplayStackParams } from '.';
import AddCommentModal from '../components/AddCommentModal';
import EventDisplayContact from './Contact';
import EventDisplayDescription from './Description';
import EventDisplayProgram from './Program';
import AddMessageModal from './components/AddMessageModal';
import getStyles from './styles';

// Common types
type Navigation = EventDisplayScreenNavigationProp<'Display'>;
type Route = RouteProp<EventDisplayStackParams, 'Display'>;
type CombinedReqState = {
  events: EventRequestState;
  comments: CommentRequestState;
};

type EventDisplayProps = {
  route: Route;
  navigation: Navigation;
  item: Event | null;
  dataUpcoming: EventPreload[];
  dataPassed: EventPreload[];
  search: EventPreload[];
  reqState: CombinedReqState;
  account: Account;
  preferences: Preferences;
  dual?: boolean;
};

const EventDisplay: React.FC<EventDisplayProps> = ({
  route,
  navigation,
  dataUpcoming,
  dataPassed,
  search,
  item,
  reqState,
  account,
  preferences,
  dual = false,
}) => {
  // Pour changer le type de route.params, voir ../index.tsx
  const { id, verification = false } = route.params;

  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;
  const dimensions = useWindowDimensions();

  const event: Event | EventPreload | undefined | null =
    item?._id === id
      ? item
      : dataUpcoming.find((a) => a._id === id) ||
        dataPassed.find((a) => a._id === id) ||
        search.find((a) => a._id === id) ||
        null;

  const [commentsDisplayed, setCommentsDisplayed] = React.useState(false);

  const fetch = () => {
    if (verification) {
      fetchEventVerification(id);
    } else {
      fetchEvent(id).then(() => {
        if (preferences.history && event) {
          addEventRead(id, event.title);
        }
        setCommentsDisplayed(true);
      });
      if (account.loggedIn) {
        fetchEventMy(id);
      }
    }
  };

  React.useEffect(() => {
    fetch();
    updateComments('initial', { parentId: id });
  }, [id]);

  const scrollViewRef = React.createRef<ScrollView>();

  const [isCommentModalVisible, setCommentModalVisible] = React.useState(false);
  const [isArticleReportModalVisible, setArticleReportModalVisible] = React.useState(false);
  const [isMessageModalVisible, setMessageModalVisible] = React.useState(false);

  const [isCommentReportModalVisible, setCommentReportModalVisible] = React.useState(false);
  const [focusedComment, setFocusedComment] = React.useState<string | null>(null);

  const [replyingToComment, setReplyingToComment] = React.useState<string | null>(null);

  const scrollY = new Animated.Value(0);

  const deleteEvent = () =>
    eventDelete(id)
      .then(() => {
        navigation.goBack();
        Alert.alert(
          'Évènement supprimé',
          "Vous pouvez contacter l'équipe Topic au plus tard après deux semaines pour éviter la suppression définitive.",
          [{ text: 'Fermer' }],
          {
            cancelable: true,
          },
        );
      })
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: "la suppression de l'évènement",
          error,
          retry: deleteEvent,
        }),
      );

  const deverifyEvent = () =>
    eventDeverify(id)
      .then(() => {
        navigation.goBack();
        Alert.alert(
          'Évènement remis en modération',
          "Vous pouvez le voir dans l'onglet modération",
          [{ text: 'Fermer' }],
          {
            cancelable: true,
          },
        );
      })
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: "la dévérification de l'évènement",
          error,
          retry: deverifyEvent,
        }),
      );

  const approveEvent = () =>
    eventVerificationApprove(event?._id || '')
      .then(() => navigation.goBack())
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: "l'approbation de l'évènement",
          error,
          retry: approveEvent,
        }),
      );

  if (!event) {
    // This is when event has not been loaded in list, so we have absolutely no info
    return (
      <View style={styles.page}>
        <AnimatingHeader
          hideBack={dual}
          value={scrollY}
          title={Platform.OS === 'ios' ? '' : 'Évènement'}
          subtitle={Platform.OS === 'ios' ? 'Évènements' : ''}
        />
        {reqState.events.info.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération de cet évènement',
              contentSingular: "L'évènement",
            }}
            error={reqState.events.info.error}
            retry={fetch}
          />
        )}
        {reqState.events.info.loading && (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    );
  }

  const { title } = event;
  const subtitle = verification ? 'Évènement · Modération' : 'Évènement';

  navigation.setOptions({ title });

  return (
    <View style={styles.page}>
      <AnimatingHeader
        hideBack={dual}
        value={scrollY}
        title={Platform.OS === 'ios' ? '' : title}
        subtitle={Platform.OS === 'ios' ? 'Évènements' : subtitle}
        actions={[
          {
            icon: 'share-variant',
            onPress: () => {
              if (!event) return;
              shareContent({
                title: event.title,
                group: event.group?.displayName,
                type: 'evenements',
                id: event._id,
              });
            },
            label: 'Partager',
          },
        ]}
        overflow={[
          {
            title: 'Signaler',
            onPress: () => setArticleReportModalVisible(true),
          },
          ...(checkPermission(account, {
            permission: Permissions.EVENT_DELETE,
            scope: { groups: [event?.group?._id] },
          })
            ? [
                {
                  title: 'Supprimer',
                  onPress: () =>
                    Alert.alert(
                      'Supprimer cette évènement ?',
                      'Les autres administrateurs du groupe seront notifiés.',
                      [
                        { text: 'Annuler' },
                        {
                          text: 'Supprimer',
                          onPress: deleteEvent,
                        },
                      ],
                      { cancelable: true },
                    ),
                },
              ]
            : []),
          ...(checkPermission(account, {
            permission: Permissions.EVENT_VERIFICATION_DEVERIFY,
            scope: { groups: [event?.group?._id || ''] },
          })
            ? [
                {
                  title: 'Dévérifier',
                  onPress: () =>
                    Alert.alert(
                      'Remettre cet article en modération ?',
                      'Les autres administrateurs du groupe seront notifiés.',
                      [
                        { text: 'Annuler' },
                        {
                          text: 'Dévérifier',
                          onPress: () => {
                            deverifyEvent();
                          },
                        },
                      ],
                      { cancelable: true },
                    ),
                },
              ]
            : []),
        ]}
      >
        {reqState.events.info.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération de cet évènement',
              contentSingular: "L'évènement",
            }}
            error={reqState.events.info.error}
            retry={() => fetchEvent(id)}
          />
        )}
      </AnimatingHeader>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
      >
        <View>
          {event.image?.image && (
            <PlatformTouchable
              onPress={() =>
                navigation.push('Root', {
                  screen: 'Main',
                  params: {
                    screen: 'Display',
                    params: {
                      screen: 'Image',
                      params: {
                        screen: 'Display',
                        params: { image: event?.image?.image },
                      },
                    },
                  },
                })
              }
            >
              <AutoHeightImage
                source={{ uri: getImageUrl({ image: event.image, size: 'full' }) || '' }}
                width={dimensions.width}
                maxHeight={400}
                style={[styles.image, { minHeight: 150 }]}
              />
            </PlatformTouchable>
          )}
          <View style={styles.contentContainer}>
            <Title style={styles.title}>{event.title}</Title>
            <Text style={styles.subtitle}>
              {event.duration?.start && event?.duration?.end
                ? `Du ${moment(event.duration?.start).format('DD/MM/YYYY')} au ${moment(
                    event.duration?.end,
                  ).format('DD/MM/YYYY')}`
                : 'Aucune date spécifiée'}
            </Text>
          </View>
          <TagList item={event} scrollable />
          {(reqState.events.info.loading ||
            reqState.events.delete?.loading ||
            reqState.events.verification_deverify?.loading) && (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
          {!event.preload && reqState.events.info.success && (
            <View>
              <CustomTabView
                scrollEnabled={false}
                pages={[
                  {
                    key: 'description',
                    title: 'Description',
                    component: (
                      <EventDisplayDescription
                        id={id}
                        event={event}
                        navigation={navigation}
                        setCommentModalVisible={setCommentModalVisible}
                        setMessageModalVisible={setMessageModalVisible}
                        setReplyingToComment={setReplyingToComment}
                        setFocusedComment={setFocusedComment}
                        verification={verification}
                        commentsDisplayed={commentsDisplayed}
                        setCommentReportModalVisible={setCommentReportModalVisible}
                      />
                    ),
                  },
                  ...(Array.isArray(event.program) && event.program.length
                    ? [
                        {
                          key: 'program',
                          title: 'Programme',
                          component: <EventDisplayProgram event={event} />,
                          onVisible: () => scrollViewRef.current?.scrollToEnd({ animated: true }),
                        },
                      ]
                    : []),
                  ...(event.contact?.phone ||
                  event.contact?.email ||
                  event.members?.length ||
                  event.contact?.other?.length
                    ? [
                        {
                          key: 'contact',
                          title: 'Contact',
                          component: <EventDisplayContact event={event} navigation={navigation} />,
                        },
                      ]
                    : []),
                ]}
              />
              {verification && (
                <View>
                  <View style={[styles.container, { marginTop: 40 }]}>
                    <Card
                      elevation={0}
                      style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
                    >
                      <View style={[styles.container, { flexDirection: 'row' }]}>
                        <Icon
                          name="shield-alert-outline"
                          style={{ alignSelf: 'flex-start', marginRight: 10 }}
                          size={24}
                          color={colors.primary}
                        />
                        <Text style={{ color: colors.text, flex: 1 }}>
                          Pour vérifier cet évènement:{'\n'}- Vérifiez que le contenu est bien
                          conforme aux conditions générales d&apos;utilisation{'\n'}- Vérifiez que
                          tous les médias sont conformes et que vous avez bien le droit
                          d&apos;utiliser ceux-ci{'\n'}- Visitez chacun des liens afin de vous
                          assurer que tous les sites sont conformes{'\n'}
                          {'\n'}
                          Nous vous rappelons que les contenus suivants ne sont pas autorisés :{' '}
                          {'\n'}- Tout contenu illégal{'\n'}- Tout contenu haineux ou
                          discriminatoire{'\n'}- Tout contenu à caractère pornographique ou qui ne
                          convient pas aux enfants
                          {'\n'}- Toute atteinte à la propriété intellectuelle{'\n'}- Tout contenu
                          trompeur{'\n'}- Toute atteinte à la vie privée{'\n'}- Tout contenu publié
                          de façon automatisée
                          {'\n'}- Tout contenu qui pointe vers un site web, logiciel ou autre média
                          qui ne respecte pas les présentes règles{'\n'}
                          {'\n'}
                          En tant qu&apos;administrateur, vous êtes en partie responsable des
                          contenus publiés, comme détaillé dans la Charte des administrateurs.
                        </Text>
                      </View>
                    </Card>
                  </View>
                  {event?.description?.data?.match(
                    /(?:(?:https?|http):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/g,
                  )?.length && (
                    <View style={[styles.container, { marginTop: 20 }]}>
                      <Card
                        elevation={0}
                        style={{ borderColor: colors.disabled, borderWidth: 1, borderRadius: 5 }}
                      >
                        <View style={[styles.container, { flexDirection: 'row' }]}>
                          <Icon
                            name="link"
                            style={{ alignSelf: 'flex-start', marginRight: 10 }}
                            size={24}
                            color={colors.disabled}
                          />
                          <Text style={{ color: colors.text }}>
                            Liens contenus dans l&apos;évènement:{'\n'}
                            {event?.description?.data
                              ?.match(/(?:(?:https?|http):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/g)
                              ?.map((u) => (
                                <Text
                                  style={{ textDecorationLine: 'underline' }}
                                  onPress={() => handleUrl(u)}
                                >
                                  {u}
                                  {'\n'}
                                </Text>
                              ))}
                          </Text>
                        </View>
                      </Card>
                    </View>
                  )}
                  <View style={[styles.container, { marginTop: 20 }]}>
                    {(event as EventVerification).verification?.bot?.flags?.length !== 0 && (
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name="tag"
                          color={colors.invalid}
                          size={16}
                          style={{ alignSelf: 'center', marginRight: 5 }}
                        />
                        <Text>
                          Classifié comme{' '}
                          {(event as EventVerification).verification?.bot?.flags?.join(', ')}
                        </Text>
                      </View>
                    )}
                    {(event as EventVerification).verification?.reports?.length !== 0 && (
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name="message-alert"
                          color={colors.invalid}
                          size={16}
                          style={{ alignSelf: 'center', marginRight: 5 }}
                        />
                        <Text>
                          Reporté {(event as EventVerification).verification?.reports?.length} fois
                        </Text>
                      </View>
                    )}
                    {(event as EventVerification).verification?.users?.length !== 0 && (
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name="shield"
                          color={colors.invalid}
                          size={16}
                          style={{ alignSelf: 'center', marginRight: 5 }}
                        />
                        <Text>Remis en moderation</Text>
                      </View>
                    )}
                    {(event as EventVerification).verification?.extraVerification && (
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name="alert-decagram"
                          color={colors.invalid}
                          size={16}
                          style={{ alignSelf: 'center', marginRight: 5 }}
                        />
                        <Text>Vérification d&apos;un administrateur Topic requise</Text>
                      </View>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={[styles.container]}>
                      <Button
                        mode="outlined"
                        color={colors.invalid}
                        contentStyle={{
                          height: 50,
                          alignSelf: 'stretch',
                          justifyContent: 'center',
                        }}
                        onPress={() => setArticleReportModalVisible(true)}
                      >
                        Signaler
                      </Button>
                    </View>
                    <View style={styles.container}>
                      <Button
                        mode="contained"
                        loading={reqState.events.verification_approve?.loading}
                        color={colors.valid}
                        contentStyle={{
                          height: 50,
                          justifyContent: 'center',
                        }}
                        onPress={approveEvent}
                      >
                        Approuver
                      </Button>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.ScrollView>
      <AddCommentModal
        visible={isCommentModalVisible}
        setVisible={setCommentModalVisible}
        replyingToComment={replyingToComment}
        setReplyingToComment={setReplyingToComment}
        id={id}
        group={event?.group?._id}
        reqState={reqState}
        add={(
          publisher: { type: 'user' | 'group'; user?: string | null; group?: string | null },
          content: Content,
          parent: string,
          isReplying: boolean,
        ) =>
          commentAdd(publisher, content, parent, isReplying ? 'comment' : 'event').then(() =>
            updateComments('initial', { parentId: id }),
          )
        }
      />
      <AddMessageModal
        visible={isMessageModalVisible}
        setVisible={setMessageModalVisible}
        id={id}
        state={reqState.events}
        defaultGroup={event?.group?._id}
        key={event?.group?._id || 'unk'}
        add={(group: string, content: Content, type: 'high' | 'medium' | 'low') =>
          eventMessagesAdd(id, group, content, type).then(fetch)
        }
      />
      <ReportModal
        visible={isArticleReportModalVisible}
        setVisible={setArticleReportModalVisible}
        contentId={id}
        report={eventReport}
        state={reqState.events.report}
        navigation={navigation}
      />
      <ReportModal
        visible={isCommentReportModalVisible}
        setVisible={setCommentReportModalVisible}
        contentId={focusedComment || ''}
        report={commentReport}
        state={reqState.comments.report}
        navigation={navigation}
      />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { events, eventData, comments, account, preferences } = state;
  return {
    dataUpcoming: events.dataUpcoming,
    dataPassed: events.dataPassed,
    search: events.search,
    item: events.item,
    reqState: { events: events.state, comments: comments.state },
    preferences,
    account,
  };
};

export default connect(mapStateToProps)(EventDisplay);
