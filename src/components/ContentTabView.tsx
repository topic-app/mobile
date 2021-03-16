import { useNavigation } from '@react-navigation/core';
import _ from 'lodash';
import React from 'react';
import { View, ActivityIndicator, FlatList } from 'react-native';
import { useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { clearArticles, searchArticles } from '@redux/actions/api/articles';
import { clearEvents, searchEvents } from '@redux/actions/api/events';
import { clearGroups, searchGroups } from '@redux/actions/api/groups';
import getStyles from '@styles/global';
import {
  ArticlePreload,
  EventPreload,
  ArticleRequestState,
  EventRequestState,
  State,
  GroupPreload,
  GroupRequestState,
  Group,
  Account,
} from '@ts/types';

import { InlineCard } from './Cards';
import CustomTabView from './CustomTabView';
import ErrorMessage from './ErrorMessage';
import { CategoryTitle } from './Typography';
import ArticleCard from './cards/Article';
import EventCard from './cards/Event';

type ContentTabViewProps = {
  searchParams: { authors?: string[]; groups?: string[]; tags?: string[]; schools?: string[] };
  types?: ('articles' | 'events' | 'groups')[];
  showHeader?: boolean;
  header?: string;
  maxCards?: number;
  articles: ArticlePreload[];
  events: EventPreload[];
  groups: (GroupPreload | Group)[];
  articlesState: ArticleRequestState;
  eventsState: EventRequestState;
  groupsState: GroupRequestState;
  account: Account;
};

const ContentTabView: React.FC<ContentTabViewProps> = React.memo(
  ({
    searchParams,
    articles,
    events,
    groups,
    articlesState,
    eventsState,
    groupsState,
    types = ['articles', 'events'],
    showHeader = true,
    header,
    maxCards = 0,
    account,
  }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    const navigation = useNavigation();

    React.useEffect(() => {
      console.log('ContentTabView useEffect');
      if (types.includes('articles')) {
        clearArticles(false, true, false, false);
        searchArticles('initial', '', searchParams, false);
      }
      if (types.includes('events')) {
        clearEvents(false, true);
        searchEvents('initial', '', searchParams, false);
      }
      if (types.includes('groups')) {
        clearGroups(false, true, false);
        searchGroups('initial', '', searchParams, false);
      }
      // Use JSON.stringify sparingly with deep equality checks
      // Make sure the data that you want to stringify is somewhat small
      // otherwise it will hurt performance
    }, [JSON.stringify(searchParams)]);

    const pages = [];

    if (articles.length && types.includes('articles')) {
      pages.push({
        key: 'articles',
        title: 'Articles',
        component: (
          <View style={{ flex: 1 }}>
            {articlesState.search?.error && (
              <ErrorMessage
                type="axios"
                strings={{
                  what: 'le chargement des articles',
                  contentPlural: 'les articles',
                }}
                error={articlesState.search?.error}
                retry={() => searchArticles('initial', '', searchParams, false)}
              />
            )}
            {articlesState.search?.loading.initial && (
              <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
            {articlesState.search?.success && (
              <FlatList
                scrollEnabled={false}
                data={maxCards ? articles.slice(0, maxCards) : articles}
                keyExtractor={(i) => i._id}
                ListFooterComponent={
                  articlesState.search.loading.initial ? (
                    <View style={[styles.container, { height: 50 }]}>
                      <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                  ) : null
                }
                renderItem={({ item }: { item: ArticlePreload }) => (
                  <ArticleCard
                    article={item}
                    unread
                    navigate={() =>
                      navigation.navigate('Root', {
                        screen: 'Main',
                        params: {
                          screen: 'Display',
                          params: {
                            screen: 'Article',
                            params: {
                              screen: 'Display',
                              params: {
                                id: item._id,
                                title: item.title,
                                useLists: false,
                              },
                            },
                          },
                        },
                      })
                    }
                  />
                )}
              />
            )}
          </View>
        ),
      });
    }

    if (events.length && types.includes('events')) {
      pages.push({
        key: 'events',
        title: 'Évènements',
        component: (
          <View style={{ flex: 1 }}>
            {eventsState.search?.error && (
              <ErrorMessage
                type="axios"
                strings={{
                  what: 'le chargement des évènements',
                  contentPlural: 'les évènements',
                }}
                error={eventsState.search?.error}
                retry={() => searchEvents('initial', '', searchParams, false)}
              />
            )}
            {eventsState.search?.loading.initial && (
              <View style={styles.container}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
            {eventsState.search?.success && (
              <FlatList
                scrollEnabled={false}
                data={maxCards ? events.slice(0, maxCards) : events}
                keyExtractor={(i) => i._id}
                ListFooterComponent={
                  eventsState.search.loading.initial ? (
                    <View style={[styles.container, { height: 50 }]}>
                      <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                  ) : null
                }
                renderItem={({ item }: { item: EventPreload }) => (
                  <EventCard
                    event={item}
                    navigate={() =>
                      navigation.navigate('Root', {
                        screen: 'Main',
                        params: {
                          screen: 'Display',
                          params: {
                            screen: 'Event',
                            params: {
                              screen: 'Display',
                              params: {
                                id: item._id,
                                title: item.title,
                                useLists: false,
                              },
                            },
                          },
                        },
                      })
                    }
                  />
                )}
              />
            )}
          </View>
        ),
      });
    }

    return (
      <View style={{ flex: 1 }}>
        {types.includes('groups') && !!groupsState.search?.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'le chargement des groups',
              contentPlural: 'les groups',
            }}
            error={groupsState.search?.error}
            retry={() => searchGroups('initial', '', searchParams, false)}
          />
        )}
        {types.includes('groups') && (
          <View>
            {groups
              .sort((a, b) => (b.cache?.followers || 0) - (a.cache?.followers || 0))
              .map((g) => (
                <View key={g._id}>
                  <InlineCard
                    avatar={g?.avatar}
                    title={g?.name || g?.displayName}
                    subtitle={`Groupe ${g?.type}`}
                    onPress={() =>
                      navigation.navigate('Root', {
                        screen: 'Main',
                        params: {
                          screen: 'Display',
                          params: {
                            screen: 'Group',
                            params: {
                              screen: 'Display',
                              params: { id: g?._id, title: g?.displayName },
                            },
                          },
                        },
                      })
                    }
                    badge={
                      account.loggedIn &&
                      account.accountInfo?.user &&
                      account.accountInfo?.user?.data?.following?.groups.some(
                        (gr) => gr._id === gr?._id,
                      )
                        ? 'heart'
                        : g?.official
                        ? 'check-decagram'
                        : undefined
                    }
                    badgeColor={colors.primary}
                  />
                </View>
              ))}
          </View>
        )}
        {showHeader && !!(articles.length || events.length) && (
          <View style={styles.container}>
            <CategoryTitle>
              {header || (pages.length === 1 ? `Derniers ${pages[0].title}` : 'Derniers contenus')}
            </CategoryTitle>
          </View>
        )}
        {articlesState.search?.loading?.initial || eventsState.search?.loading?.initial ? (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          (articles.length !== 0 || events.length !== 0) && (
            <View style={{ flex: 1 }}>
              <CustomTabView hideTabBar={pages.length < 2} scrollEnabled={false} pages={pages} />
              <View style={{ height: 20 }} />
            </View>
          )
        )}
      </View>
    );
  },
  // Function to tell React whether the component should rerender or not
  (prevProps, nextProps) => {
    // Compare all props to see if they've changed
    const prev = {
      params: prevProps.searchParams,
      // Only check ids because checking objects will take forever
      articleIds: prevProps.articles.map((a) => a._id),
      eventIds: prevProps.events.map((e) => e._id),
      groupIds: prevProps.groups.map((g) => g._id),
      articleState: prevProps.articlesState,
      eventState: prevProps.eventsState,
      groupsState: prevProps.groupsState,
    };

    const next = {
      params: nextProps.searchParams,
      articleIds: nextProps.articles.map((a) => a._id),
      eventIds: nextProps.events.map((e) => e._id),
      groupIds: nextProps.groups.map((d) => d._id),
      articleState: nextProps.articlesState,
      eventState: nextProps.eventsState,
      groupsState: nextProps.groupsState,
    };

    // Lodash performs deep equality check, works with arrays and objects
    // true = equal props = component does not rerender
    // false = props changed = component rerenders
    return _.isEqual(prev, next);
  },
);

const mapStateToProps = (state: State) => {
  const { articles, events, groups, account } = state;
  return {
    articles: articles.search,
    events: events.search,
    groups: groups.search,
    articlesState: articles.state,
    eventsState: events.state,
    groupsState: groups.state,
    account,
  };
};

export default connect(mapStateToProps)(ContentTabView);
