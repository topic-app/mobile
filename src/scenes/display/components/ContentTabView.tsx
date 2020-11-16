import React from 'react';
import { View, ActivityIndicator, FlatList } from 'react-native';
import {
  CategoryTitle,
  CustomTabView,
  ErrorMessage,
  ArticleCard,
  EventCard,
} from '@components/index';
import { Divider } from 'react-native-paper';
import { searchArticles } from '@redux/actions/api/articles';
import { useTheme } from '@utils/index';
import { ArticlePreload, EventPreload, ArticleRequestState, EventRequestState } from '@ts/types';
import getStyles from '@styles/Styles';
import { useNavigation } from '@react-navigation/core';
import { searchEvents } from '@redux/actions/api/events';

type ContentTabViewProps = {
  articles: ArticlePreload[];
  events: EventPreload[];
  articlesState: ArticleRequestState;
  eventsState: EventRequestState;
  params?: { authors?: string[]; groups?: string[] };
};

const ContentTabView = ({
  params = {},
  articles,
  events,
  articlesState,
  eventsState,
}: ContentTabViewProps) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const navigation = useNavigation();
  return (
    <View>
      {(articles.length !== 0 || events.length !== 0) && (
        <View>
          <View style={styles.container}>
            <CategoryTitle>Derniers contenus</CategoryTitle>
          </View>
          <Divider />
          <CustomTabView
            scrollEnabled={false}
            pages={[
              ...(articles.length
                ? [
                    {
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
                              retry={() => searchArticles('initial', '', params, false)}
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
                    },
                  ]
                : []),
              ...(events.length
                ? [
                    {
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
                              retry={() => searchEvents('initial', '', params, false)}
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
                    },
                  ]
                : []),
            ]}
          />
          <View style={{ height: 20 }} />
        </View>
      )}
    </View>
  );
};

export default ContentTabView;
