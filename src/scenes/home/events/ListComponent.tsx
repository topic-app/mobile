import React from 'react';
import { View, Animated } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  ErrorMessage,
  GroupsBanner,
  VerificationBanner,
  ContentFlatList,
  ContentSection,
  EVENT_CARD_HEADER_HEIGHT,
} from '@components';
import { Permissions } from '@constants';
import {
  updateUpcomingEvents,
  updatePassedEvents,
  searchEvents,
  updateEventsFollowing,
  clearEvents,
} from '@redux/actions/api/events';
import getStyles from '@styles/global';
import {
  State,
  EventListItem,
  EventReadItem,
  EventPreload,
  EventPrefs,
  EventQuickItem,
  EventRequestState,
  Account,
  AnyEvent,
} from '@ts/types';
import { checkPermission } from '@utils';

import EventListCard from './components/Card';
import EventEmptyList from './components/EmptyList';

type EventListComponentProps = {
  scrollY: Animated.Value;
  onEventPress: (event: { id: string; title: string; useLists: boolean }) => any;
  onConfigurePressed?: () => void;
  onEventCreatePressed: () => void;
  historyEnabled: boolean;
  initialTabKey?: string;
  upcomingEvents: EventPreload[];
  passedEvents: EventPreload[];
  followingEvents: EventPreload[];
  search: EventPreload[];
  lists: EventListItem[];
  read: EventReadItem[];
  quicks: EventQuickItem[];
  eventPrefs: EventPrefs;
  state: EventRequestState;
  account: Account;
};

const EventListComponent: React.FC<EventListComponentProps> = ({
  scrollY,
  upcomingEvents,
  passedEvents,
  followingEvents,
  search,
  lists,
  read,
  quicks,
  state,
  eventPrefs,
  historyEnabled,
  account,
  onEventPress,
  onConfigurePressed,
  onEventCreatePressed,
  initialTabKey,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const sections: ContentSection<AnyEvent>[] = [];

  eventPrefs.categories?.forEach((categKey) => {
    const categCommon: Partial<ContentSection<AnyEvent>> = {
      group: 'categories',
      loading: state.list.loading,
    };
    if (categKey === 'upcoming') {
      sections.push({
        key: 'upcoming',
        title: 'À venir',
        data: upcomingEvents,
        onLoad: async (loadType) => {
          if (loadType !== 'initial') {
            await updateUpcomingEvents(loadType);
          }
        },
        ...categCommon,
      });
    } else if (categKey === 'passed') {
      sections.push({
        key: 'passed',
        title: 'Finis',
        data: passedEvents,
        onLoad: async (loadType) => {
          if (loadType !== 'initial') {
            await updatePassedEvents(loadType);
          }
        },
        ...categCommon,
      });
    } else if (categKey === 'following' && account.loggedIn) {
      const { users, groups } = account.accountInfo.user.data.following;
      if (users.length + groups.length > 0) {
        sections.push({
          key: 'following',
          title: 'Suivis',
          data: followingEvents,
          onLoad: async (loadType) => {
            if (loadType !== 'initial') {
              await updateEventsFollowing(loadType);
            }
          },
          ...categCommon,
          loading: state.following?.loading,
        });
      }
    }
  });

  lists.forEach((l) => {
    sections.push({
      key: l.id,
      title: l.name,
      description: l.description,
      icon: l.icon,
      data: l.items,
      group: 'lists',
    });
  });

  quicks.forEach((q) => {
    let params = {};
    let icon = 'alert-decagram';
    switch (q.type) {
      case 'tag':
        params = { tags: [q.id] };
        icon = 'pound';
        break;
      case 'user':
        params = { users: [q.id] };
        icon = 'account';
        break;
      case 'group':
        params = { groups: [q.id] };
        icon = 'account-multiple';
        break;
      case 'school':
        params = { schools: [q.id] };
        icon = 'school';
        break;
      case 'departement':
        params = {
          departments: [q.id],
        };
        icon = 'map-marker-radius';
        break;
      case 'region':
        params = {
          departments: [q.id],
        };
        icon = 'map-marker-radius';
        break;
      case 'global':
        params = {
          global: true,
        };
        icon = 'flag';
        break;
    }
    sections.push({
      key: q.id,
      title: q.title,
      icon,
      data: search,
      group: 'quicks',
      loading: state.search?.loading,
      onLoad: async (loadType) => {
        if (loadType === 'initial') {
          clearEvents(false, true);
        }
        await searchEvents(loadType, '', params, false, false);
      },
    });
  });

  React.useEffect(() => {
    updateUpcomingEvents('initial');
    updatePassedEvents('initial');
    updateEventsFollowing('initial');
  }, [null]);

  const [cardWidth, setCardWidth] = React.useState(100);
  const imageSize = cardWidth / 3.5;

  const itemHeight = EVENT_CARD_HEADER_HEIGHT + imageSize;

  return (
    <View
      style={styles.page}
      onLayout={({ nativeEvent }) => setCardWidth(nativeEvent.layout.width)}
    >
      <ContentFlatList
        scrollY={scrollY}
        initialSection={initialTabKey}
        sections={sections}
        keyExtractor={(event) => event._id}
        renderItem={({ item: event, sectionKey, group }) => (
          <EventListCard
            event={event}
            group={group}
            sectionKey={sectionKey}
            isRead={read.some((r) => r.id === event._id)}
            historyActive={historyEnabled}
            lists={lists}
            overrideImageWidth={imageSize}
            navigate={() =>
              onEventPress({
                id: event._id,
                title: event.title,
                useLists: group === 'lists',
              })
            }
          />
        )}
        itemHeight={itemHeight}
        ListHeaderComponent={({ sectionKey, group, retry }) => (
          <View>
            <GroupsBanner />
            <VerificationBanner />
            {(state.list.error && group === 'categories') ||
            (state.search?.error && group === 'quicks') ||
            (state.following?.error && group === 'categories' && sectionKey === 'following') ? (
              <ErrorMessage
                type="axios"
                strings={{
                  what: 'la récupération des évènements',
                  contentPlural: 'des évènements',
                  contentSingular: "La liste d'évènements",
                }}
                error={[state.list.error, state.search?.error, state.following?.error]}
                retry={retry}
              />
            ) : null}
          </View>
        )}
        ListEmptyComponent={(props) => <EventEmptyList reqState={state} {...props} />}
        onConfigurePress={onConfigurePressed}
      />
      {checkPermission(account, {
        permission: Permissions.EVENT_ADD,
        scope: {},
      }) && <FAB icon="plus" onPress={onEventCreatePressed} style={styles.bottomRightFab} />}
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { events, eventData, account, preferences } = state;
  return {
    upcomingEvents: events.dataUpcoming,
    passedEvents: events.dataPassed,
    followingEvents: events.following,
    search: events.search,
    eventPrefs: eventData.prefs,
    lists: eventData.lists,
    quicks: eventData.quicks,
    read: eventData.read,
    state: events.state,
    account,
    historyEnabled: preferences.history,
  };
};

export default connect(mapStateToProps)(EventListComponent);
