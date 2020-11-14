import React from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  Animated,
  Platform,
  Share,
  ScrollView,
} from 'react-native';
import { Text, Title, Card, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import {
  State,
  CommentRequestState,
  Account,
  EventRequestState,
  Comment,
  Event,
  Preferences,
  EventPreload,
  EventListItem,
} from '@ts/types';
import {
  ErrorMessage,
  TagList,
  AnimatingHeader,
  ReportModal,
  CustomTabView,
} from '@components/index';
import { useTheme, getImageUrl, handleUrl } from '@utils/index';
import getStyles from '@styles/Styles';
import { eventReport, eventVerificationApprove } from '@redux/actions/apiActions/events';
import { fetchEvent, fetchEventVerification } from '@redux/actions/api/events';
import { addEventRead } from '@redux/actions/contentData/events';
import { updateComments } from '@redux/actions/api/comments';
import { commentAdd, commentReport } from '@redux/actions/apiActions/comments';

import AddCommentModal from '../../components/AddCommentModal';
import AddToListModal from '../../components/AddToListModal';
import getEventStyles from '../styles/Styles';

import type { EventDisplayStackParams } from '../index';
import EventDisplayDescription from './Description';
import EventDisplayProgram from './Program';
import EventDisplayContact from './Contact';

// Common types
type Navigation = StackNavigationProp<EventDisplayStackParams, 'Display'>;
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
  comments: Comment[];
  reqState: CombinedReqState;
  account: Account;
  lists: EventListItem[];
  preferences: Preferences;
};

const EventDisplay: React.FC<EventDisplayProps> = ({
  route,
  navigation,
  dataUpcoming,
  dataPassed,
  search,
  item,
  comments,
  reqState,
  account,
  preferences,
  lists,
}) => {
  // Pour changer le type de route.params, voir ../index.tsx
  const { id, useLists = false, verification = false } = route.params;

  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getEventStyles(theme);
  const { colors } = theme;

  let event: Event | undefined | null;
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
  const eventComments = comments.filter((c) => c.parent === event?._id);

  const fetch = () => {
    if (!(useLists && lists?.some((l: EventListItem) => l.items?.some((i) => i._id === id)))) {
      if (verification) {
        fetchEventVerification(id);
      } else {
        fetchEvent(id).then(() => {
          if (preferences.history) {
            addEventRead(id, event?.title);
          }
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
  const [focusedComment, setFocusedComment] = React.useState(null);

  const scrollY = new Animated.Value(0);

  if (!event) {
    // This is when article has not been loaded in list, so we have absolutely no info
    return (
      <View style={styles.page}>
        <AnimatingHeader
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
              ]
        }
      >
        {reqState.events.info.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération de cet article',
              contentSingular: "L'article",
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
          {event.image && (
            <Image
              source={{ uri: getImageUrl({ image: event.image, size: 'large' }) }}
              style={[styles.image, articleStyles.image]}
            />
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
          {reqState.articles.info.loading && (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
          {!event.preload && reqState.articles.info.success && (
            <View>
              <CustomTabView
                scrollEnabled={false}
                pages={[
                  {
                    key: 'description',
                    title: 'Description',
                    component: (
                      <EventDisplayDescription
                        event={event}
                        navigation={navigation}
                        setCommentModalVisible={setCommentModalVisible}
                        setFocusedComment={setFocusedComment}
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
                          Pour vérifier cet article:{'\n'}- Vérifiez que le contenu est bien
                          conforme aux conditions générales d'utilisation{'\n'}- Vérifiez que tous
                          les médias sont conformes, et que vous avez bien le droit d'utiliser
                          ceux-ci{'\n'}- Visitez chacun des liens afin de vous assurer que tous les
                          sites sont conformes{'\n'}
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
                          En tant qu'administrateur, vous êtes en partie responsable des contenus
                          publiés, comme détaillé dans la Charte des administrateurs.
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
                            Liens contenus dans l'article:{'\n'}
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
                        eventVerificationApprove(event?._id).then(() => navigation.goBack())
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
                          eventVerificationApprove(event?._id).then(() => navigation.goBack())
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
        add={(...data: any) =>
          commentAdd(...data).then(() => updateComments('initial', { parentId: id }))
        }
      />
      <ReportModal
        visible={isArticleReportModalVisible}
        setVisible={setArticleReportModalVisible}
        contentId={id}
        report={eventReport}
        state={reqState.articles.report}
      />
      <ReportModal
        visible={isCommentReportModalVisible}
        setVisible={setCommentReportModalVisible}
        contentId={focusedComment}
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
    comments: comments.data,
    reqState: { articles: events.state, comments: comments.state },
    preferences,
    lists: eventData.lists,
    account,
  };
};

export default connect(mapStateToProps)(EventDisplay);
