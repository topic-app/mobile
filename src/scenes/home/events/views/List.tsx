import React from 'react';
import { View, Animated, ActivityIndicator, AccessibilityInfo } from 'react-native';
import { ProgressBar, Banner, Text, Subheading, FAB } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { connect } from 'react-redux';

import {
  State,
  EventListItem,
  EventReadItem,
  EventPreload,
  Event,
  EventPrefs,
  Preferences,
  EventQuickItem,
  EventRequestState,
  Account,
} from '@ts/types';
import { AnimatingHeader, ErrorMessage, TabChipList } from '@components/index';
import { useTheme } from '@utils/index';
import { updateUpcomingEvents, updatePassedEvents, searchEvents } from '@redux/actions/api/events';
import getStyles from '@styles/Styles';

import EventListCard from '../components/Card';
import EventEmptyList from '../components/EmptyList';
import { HomeTwoNavParams } from '../../HomeTwo.ios';

type Category = {
  key: string;
  title: string;
  description?: string;
  data: any[];
  type: string;
  list?: boolean;
  params?: object;
};

type EventListProps = StackScreenProps<HomeTwoNavParams, 'Article'> & {
  upcomingEvents: (EventPreload | Event)[];
  passedEvents: (EventPreload | Event)[];
  search: EventPreload[];
  lists: EventListItem[];
  read: EventReadItem[];
  quicks: EventQuickItem[];
  eventPrefs: EventPrefs;
  preferences: Preferences;
  state: EventRequestState;
  account: Account;
};

const EventList: React.FC<EventListProps> = ({
  navigation,
  route,
  upcomingEvents,
  passedEvents,
  search,
  lists,
  read,
  quicks,
  state,
  eventPrefs,
  preferences,
  account,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const scrollY = new Animated.Value(0);

  const potentialCategories = [
    {
      key: 'upcoming',
      title: 'Tous',
      data: upcomingEvents,
      type: 'upcomingEvents',
    },
  ];

  if (preferences.history) {
    potentialCategories.unshift({
      key: 'passed',
      title: 'Finis',
      data: passedEvents,
      type: 'category',
    });
  }

  const categories: Category[] = [];

  eventPrefs.categories?.forEach((c) => {
    const currentCategory = potentialCategories.find((d) => d.key === c);
    if (currentCategory) categories.push(currentCategory);
  });

  const tabGroups: { key: string; data: Category[] }[] = [
    {
      key: 'categories',
      data: categories,
    },
    {
      key: 'lists',
      data: lists.map((l) => ({
        key: l.id,
        title: l.name,
        description: l.description,
        icon: l.icon,
        data: l.items,
        list: true,
        type: 'list',
      })),
    },
    {
      key: 'quicks',
      data: quicks.map((q) => {
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
        }
        return {
          key: q.id,
          title: q.title,
          icon,
          data: search,
          params,
          quickType: q.type,
          type: 'quick',
        };
      }),
    },
  ];

  const [tab, setTab] = React.useState(
    route.params?.initialList ||
      tabGroups[0].data[0]?.key ||
      tabGroups[1].data[0]?.key ||
      tabGroups[2].data[0]?.key,
  );
  const [chipTab, setChipTab] = React.useState(tab);

  const getSection = (tabKey?: string) =>
    tabGroups.find((t) => t.data.some((d) => d.key === (tabKey ?? tab)))!;
  const getCategory = (tabKey?: string) =>
    getSection(tabKey).data.find((d) => d.key === (tabKey ?? tab))!;

  const section = getSection();
  const category = getCategory();

  useFocusEffect(
    React.useCallback(() => {
      updateUpcomingEvents('initial');
      updatePassedEvents('initial');
    }, [null]),
  );

  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const changeList = async (tabKey: string) => {
    const noAnimation = await AccessibilityInfo.isReduceMotionEnabled();
    const newSection = getSection(tabKey);
    const newCategory = getCategory(tabKey);

    if (noAnimation) {
      setChipTab(tabKey);
      if (newSection.key === 'quicks') {
        searchEvents('initial', '', newCategory.params, false, false);
      }
      setTab(tabKey);
    } else {
      setChipTab(tabKey);
      Animated.timing(fadeAnim, {
        useNativeDriver: true,
        toValue: 0,
        duration: 100,
      }).start(async () => {
        if (newSection.key === 'quicks') {
          await searchEvents('initial', '', newCategory.params, false, false);
        }
        setTab(tabKey);
        Animated.timing(fadeAnim, {
          useNativeDriver: true,
          toValue: 1,
          duration: 100,
        }).start();
      });
    }
  };

  const listData = category.data;

  return (
    <View style={styles.page}>
      <AnimatingHeader
        home
        value={scrollY}
        title="Événements"
        actions={[
          {
            icon: 'magnify',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Search',
                params: {
                  screen: 'Search',
                  params: { initialCategory: 'events', previous: 'Evènements' },
                },
              }),
          },
        ]}
        overflow={[
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
          ...(preferences.history
            ? [
                {
                  title: 'Historique',
                  onPress: () =>
                    navigation.navigate('Main', {
                      screen: 'History',
                      params: {
                        screen: 'Event',
                      },
                    }),
                },
              ]
            : []),
        ]}
      >
        {(state.list.loading.initial || state.search?.loading.initial) && (
          <ProgressBar indeterminate style={{ marginTop: -4 }} />
        )}
        {state.list.error || state.search?.error ? (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération des évènements',
              contentPlural: 'des évènements',
              contentSingular: "La liste d'évènements",
            }}
            error={[state.list.error, state.search?.error]}
            retry={() => {
              updatePassedEvents('initial');
              updateUpcomingEvents('initial');
            }}
          />
        ) : null}
      </AnimatingHeader>
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        data={listData || []}
        refreshing={
          (section.key === 'categories' && state.list.loading.refresh) ||
          (section.key === 'quicks' && state.search?.loading.refresh)
        }
        onRefresh={() => {
          if (section.key === 'categories' && category.key === 'upcoming') {
            updateUpcomingEvents('refresh');
          } else if (section.key === 'categories' && category.key === 'passed') {
            updatePassedEvents('refresh');
          } else if (section.key === 'quicks') {
            searchEvents('refresh', '', category.params, false, false);
          }
        }}
        onEndReached={() => {
          if (section.key === 'categories' && category.key === 'upcoming') {
            updateUpcomingEvents('next');
          } else if (section.key === 'categories' && category.key === 'passed') {
            updatePassedEvents('next');
          } else if (section.key === 'quicks') {
            searchEvents('next', '', category.params, false, false);
          }
        }}
        ListHeaderComponent={() => (
          <View>
            <TabChipList
              sections={tabGroups}
              selected={chipTab}
              setSelected={changeList}
              configure={() =>
                navigation.navigate('Main', {
                  screen: 'Configure',
                  params: {
                    screen: 'Event',
                  },
                })
              }
            />
            {category.description ? (
              <Banner actions={[]} visible>
                <Subheading>Description</Subheading>
                <Text>{category.description}</Text>
              </Banner>
            ) : null}
          </View>
        )}
        ListEmptyComponent={() => (
          <Animated.View style={{ opacity: fadeAnim }}>
            <EventEmptyList
              tab={tab}
              sectionKey={section.key}
              reqState={state}
              navigation={navigation}
              changeTab={changeList}
            />
          </Animated.View>
        )}
        onEndReachedThreshold={0.5}
        keyExtractor={(event: Event) => event._id}
        ListFooterComponent={
          <View style={[styles.container, { height: 50 }]}>
            {((section.key === 'categories' && state.list.loading.next) ||
              (section.key === 'quicks' && state.search.loading.next)) && (
              <ActivityIndicator size="large" color={colors.primary} />
            )}
          </View>
        }
        renderItem={({ item: event }: { item: Event }) => (
          <Animated.View style={{ opacity: fadeAnim }}>
            <EventListCard
              event={event}
              sectionKey={section.key}
              itemKey={category.key}
              isRead={read.some((r) => r.id === event._id)}
              historyActive={preferences.history}
              lists={lists}
              navigate={() =>
                navigation.navigate('Main', {
                  screen: 'Display',
                  params: {
                    screen: 'Event',
                    params: {
                      screen: 'Display',
                      params: {
                        id: event._id,
                        title: event.title,
                        useLists: section.key === 'lists',
                      },
                    },
                  },
                })
              }
            />
          </Animated.View>
        )}
      />
      {account.loggedIn && account.permissions?.some((p) => p.permission === 'event.add') && (
        <FAB
          icon="pencil"
          onPress={() =>
            navigation.navigate('Main', {
              screen: 'Add',
              params: {
                screen: 'Event',
                params: {
                  screen: 'Add',
                },
              },
            })
          }
          style={styles.bottomRightFab}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { events, eventData, preferences, account } = state;
  return {
    upcomingEvents: events.dataUpcoming,
    passedEvents: events.dataPassed,
    search: events.search,
    eventPrefs: eventData.prefs,
    lists: eventData.lists,
    quicks: eventData.quicks,
    read: eventData.read,
    state: events.state,
    account,
    preferences,
  };
};

export default connect(mapStateToProps)(EventList);
