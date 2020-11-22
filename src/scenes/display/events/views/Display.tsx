import { RouteProp } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {
  View,
  ActivityIndicator,
  Animated,
  Platform,
  Share,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Text, Title, Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import {
  ErrorMessage,
  TagList,
  AnimatingHeader,
  ReportModal,
  CustomTabView,
} from '@components/index';
import { Permissions } from '@constants/index';
import { updateComments } from '@redux/actions/api/comments';
import { fetchEvent, fetchEventVerification } from '@redux/actions/api/events';
import { commentAdd, commentReport } from '@redux/actions/apiActions/comments';
import {
  eventReport,
  eventVerificationApprove,
  eventDelete,
} from '@redux/actions/apiActions/events';
import { addEventRead } from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';
import {
  State,
  CommentRequestState,
  Account,
  EventRequestState,
  Event,
  Preferences,
  EventPreload,
  EventListItem,
  Publisher,
  Content,
} from '@ts/types';
import AutoHeightImage from '@utils/autoHeightImage';
import { useTheme, getImageUrl, handleUrl } from '@utils/index';

import AddCommentModal from '../../components/AddCommentModal';
import AddToListModal from '../../components/AddToListModal';
import type { EventDisplayScreenNavigationProp, EventDisplayStackParams } from '../index';
import getEventStyles from '../styles/Styles';
import EventDisplayContact from './Contact';
import EventDisplayDescription from './Description';
import EventDisplayProgram from './Program';

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
  lists: EventListItem[];
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
  lists,
  dual = false,
}) => {
  // Pour changer le type de route.params, voir ../index.tsx
  const { id, useLists = false, verification = false } = route.params;

  const theme = useTheme();
  const styles = getStyles(theme);
  const eventStyles = getEventStyles(theme);
  const { colors } = theme;

  let event: Event | EventPreload | undefined | null;
  if (useLists && lists?.some((l: EventListItem) => l.items?.some((i) => i._id === id))) {
    event = lists
      .find((l: EventListItem) => l.items.some((i) => i._id === id))
      ?.items.find((i) => i._id === id);
  } else {
    event =
      item?._id === id
        ? item
        : dataUpcoming.find((a) => a._id === id) ||
          dataPassed.find((a) => a._id === id) ||
          search.find((a) => a._id === id) ||
          null;
  }

  const [commentsDisplayed, setCommentsDisplayed] = React.useState(false);

  const fetch = () => {
    if (!(useLists && lists?.some((l: EventListItem) => l.items?.some((i) => i._id === id)))) {
      if (verification) {
        fetchEventVerification(id);
      } else {
        fetchEvent(id).then(() => {
          if (preferences.history && event) {
            addEventRead(id, event.title);
          }
          setCommentsDisplayed(true);
        });
      }
    }
  };

  React.useEffect(() => {
    fetch();
    updateComments('initial', { parentId: id });
  }, [null]);

  const scrollViewRef = React.createRef<ScrollView>();

  const [isCommentModalVisible, setCommentModalVisible] = React.useState(false);
  const [isArticleReportModalVisible, setArticleReportModalVisible] = React.useState(false);
  const [isListModalVisible, setListModalVisible] = React.useState(false);

  const [isCommentReportModalVisible, setCommentReportModalVisible] = React.useState(false);
  const [focusedComment, setFocusedComment] = React.useState<string | null>(null);

  const scrollY = new Animated.Value(0);

  if (!event) {
    // This is when event has not been loaded in list, so we have absolutely no info
    return (
      <View style={styles.page}>
        <AnimatingHeader
          hideBack={dual}
          value={scrollY}
          title={
            route.params.title ||
            (useLists && lists?.some((l) => l.items?.some((i) => i._id === id))
              ? 'Événements - Hors ligne'
              : verification
              ? 'Événements - modération'
              : 'Événements')
          }
          subtitle={
            route.params.title &&
            (useLists && lists?.some((l) => l.items?.some((i) => i._id === id))
              ? 'Événements - Hors ligne'
              : verification
              ? 'Événements - modération'
              : 'Événements')
          }
        />
        {reqState.events.info.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération de cet événement',
              contentSingular: "L'événement",
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

  return (
    <View style={styles.page}>
      <AnimatingHeader
        hideBack={dual}
        value={scrollY}
        title={
          route.params.title ||
          (useLists && lists?.some((l) => l.items?.some((i) => i._id === id))
            ? 'Événement - Hors ligne'
            : verification
            ? 'Événement - modération'
            : 'Événement')
        }
        subtitle={
          route.params.title &&
          (useLists && lists?.some((l) => l.items?.some((i) => i._id === id))
            ? 'Événement - Hors ligne'
            : verification
            ? 'Événement - modération'
            : 'Événement')
        }
        actions={
          verification
            ? undefined
            : [
                {
                  icon: 'playlist-plus',
                  onPress: () => setListModalVisible(true),
                },
              ]
        }
        overflow={
          verification
            ? undefined
            : [
                {
                  title: 'Partager',
                  onPress:
                    Platform.OS === 'ios'
                      ? () =>
                          Share.share({
                            message: `${event?.title} par ${event?.group?.displayName}`,
                            url: `https://go.topicapp.fr/evenements/${event?._id}`,
                          })
                      : () =>
                          Share.share({
                            message: `https://go.topicapp.fr/evenements/${event?._id}`,
                            title: `${event?.title} par ${event?.group?.displayName}`,
                          }),
                },
                {
                  title: 'Signaler',
                  onPress: () => setArticleReportModalVisible(true),
                },
                ...(account.permissions?.some(
                  (p) =>
                    p.permission === Permissions.EVENT_DELETE &&
                    (p.scope.groups.includes(id) || p.scope.everywhere),
                )
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
                                onPress: () =>
                                  eventDelete(id).then(() => {
                                    navigation.goBack();
                                    Alert.alert(
                                      'Évènement supprimé',
                                      "Vous pouvez contacter l'équipe Topic au plus tard après deux semaines pour éviter la suppression définitive.",
                                      [{ text: 'Fermer' }],
                                      {
                                        cancelable: true,
                                      },
                                    );
                                  }),
                              },
                            ],
                            { cancelable: true },
                          ),
                      },
                    ]
                  : []),
              ]
        }
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
        {reqState.events.delete?.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la suppression de cet évènement',
              contentSingular: "La suppression de l'évènement",
            }}
            error={reqState.events.delete.error}
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
            <View style={[styles.image, { minHeight: 150 }]}>
              <AutoHeightImage
                source={{ uri: getImageUrl({ image: event.image, size: 'full' }) || '' }}
                width={Dimensions.get('window').width}
                maxHeight={400}
              />
            </View>
          )}
          <View style={styles.contentContainer}>
            <Title style={styles.title}>{event.title}</Title>
            <Text style={styles.subtitle}>
              {event.duration?.start && event?.duration?.end
                ? `Du ${moment(event.duration?.start).format('DD/MM/YYYY')} au ${moment(
                    event.duration?.end,
                  ).format('DD/MM/YYYY')}`
                : 'Aucune Date Spécifiée'}
            </Text>
          </View>
          <TagList item={event} scrollable />
          {useLists && (
            <View
              style={[
                styles.contentContainer,
                { flexDirection: 'row', marginBottom: 0, alignItems: 'center' },
              ]}
            >
              <Icon
                style={{ marginRight: 10 }}
                color={colors.disabled}
                size={24}
                name="cloud-off-outline"
              />
              <Title style={{ color: colors.disabled }}>Hors ligne</Title>
            </View>
          )}
          {(reqState.events.info.loading || reqState.events.delete?.loading) && (
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
                        setFocusedComment={setFocusedComment}
                        verification={verification}
                        commentsDisplayed={commentsDisplayed}
                        setCommentReportModalVisible={setCommentReportModalVisible}
                      />
                    ),
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
                    component: <EventDisplayContact event={event} navigation={navigation} />,
                  },
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
                        <Text style={{ color: colors.text }}>
                          Pour vérifier cet évènement:{'\n'}- Vérifiez que le contenu est bien
                          conforme aux conditions générales d&apos;utilisation{'\n'}- Vérifiez que
                          tous les médias sont conformes, et que vous avez bien le droit
                          d&apos;utiliser ceux-ci{'\n'}- Visitez chacun des liens afin de vous
                          assurer que tous les sites sont conformes{'\n'}
                          {'\n'}
                          Nous vous rappelons que les contenus suivants ne sont pas autorisés:{' '}
                          {'\n'}- Tout contenu illégal{'\n'}- Tout contenu haineux ou
                          discriminatoire{'\n'}- Tout contenu à caractère pornographique ou qui ne
                          convient pas aux enfants
                          {'\n'}- Toute atteinte à la propriété intellectuelle{'\n'}- Tout contenu
                          trompeur{'\n'}- Toute atteinte à la vie privée{'\n'}- Tout contenu publié
                          de façon automatisée
                          {'\n'}- Tout contenu qui pointe vers un site web, logiciel, ou autre média
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
                  {reqState.events.verification_approve?.error && (
                    <ErrorMessage
                      type="axios"
                      strings={{
                        what: "l'approbation de l'événement",
                        contentSingular: "l'événement",
                      }}
                      error={reqState.events.verification_approve?.error}
                      retry={() =>
                        eventVerificationApprove(event?._id || '').then(() => navigation.goBack())
                      }
                    />
                  )}
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
                        onPress={() =>
                          eventVerificationApprove(event?._id || '').then(() => navigation.goBack())
                        }
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
        id={id}
        reqState={reqState}
        add={(publisher: Publisher, content: Content, parent: string) =>
          commentAdd(publisher, content, parent, 'event').then(() =>
            updateComments('initial', { parentId: id }),
          )
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
      <AddToListModal
        visible={isListModalVisible}
        setVisible={setListModalVisible}
        id={id}
        type="event"
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
    lists: eventData.lists,
    account,
  };
};

export default connect(mapStateToProps)(EventDisplay);
