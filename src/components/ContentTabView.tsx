import { useNavigation } from '@react-navigation/core';
import _ from 'lodash';
import React from 'react';
import { View, ActivityIndicator, FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { connect } from 'react-redux';

import { searchArticles } from '@redux/actions/api/articles';
import { searchEvents } from '@redux/actions/api/events';
import getStyles from '@styles/Styles';
import {
  ArticlePreload,
  EventPreload,
  ArticleRequestState,
  EventRequestState,
  State,
} from '@ts/types';
import { useTheme } from '@utils/index';

import CustomTabView from './CustomTabView';
import ErrorMessage from './ErrorMessage';
import { CategoryTitle } from './Typography';
import ArticleCard from './cards/Article';
import EventCard from './cards/Event';

type ContentTabViewProps = {
  searchParams: { authors?: string[]; groups?: string[]; tags?: string[]; schools?: string[] };
  articles: ArticlePreload[];
  events: EventPreload[];
  articlesState: ArticleRequestState;
  eventsState: EventRequestState;
};

const ContentTabView: React.FC<ContentTabViewProps> = React.memo(
  ({ searchParams, articles, events, articlesState, eventsState }) => {
    const theme = useTheme();
    const { colors } = theme;
    const styles = getStyles(theme);
    const navigation = useNavigation();

    React.useEffect(() => {
      searchArticles('initial', '', searchParams, false);
      searchEvents('initial', '', searchParams, false);
      // Use JSON.stringify sparingly with deep equality checks
      // Make sure the data that you want to stringify is somewhat small
      // otherwise it will hurt performance
    }, [JSON.stringify(searchParams)]);

    const pages = [];

    if (articles.length !== 0) {
      pages.push({
        key: 'articles',
        title: 'Articles',
        component: (
          <View>
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
                data={articles}
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
                      navigation.navigate('Main', {
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

    if (events.length !== 0) {
      pages.push({
        key: 'events',
        title: 'Évènements',
        component: (
          <View>
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
                data={events}
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
                      navigation.navigate('Main', {
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
      <View>
        {(articles.length !== 0 || events.length !== 0) && (
          <View>
            <View style={styles.container}>
              <CategoryTitle>Derniers contenus</CategoryTitle>
            </View>
            <Divider />
            <CustomTabView scrollEnabled={false} pages={pages} />
            <View style={{ height: 20 }} />
          </View>
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
      articleState: prevProps.articlesState,
      eventState: prevProps.eventsState,
    };

    const next = {
      params: nextProps.searchParams,
      articleIds: nextProps.articles.map((a) => a._id),
      eventIds: nextProps.events.map((e) => e._id),
      articleState: nextProps.articlesState,
      eventState: nextProps.eventsState,
    };

    // Lodash performs deep equality check, works with arrays and objects
    // true = equal props = component does not rerender
    // false = props changed = component rerenders
    return _.isEqual(prev, next);
  },
);

const mapStateToProps = (state: State) => {
  const { articles, events } = state;
  return {
    articles: articles.search,
    events: events.search,
    articlesState: articles.state,
    eventsState: events.state,
  };
};

export default connect(mapStateToProps)(ContentTabView);
