import React from 'react';
import { View, Animated, ActivityIndicator, AccessibilityInfo, Platform } from 'react-native';
import { ProgressBar, Banner, Text, Subheading, FAB, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { connect } from 'react-redux';

import {
  State,
  ArticleListItem,
  ArticleReadItem,
  ArticlePreload,
  Article,
  ArticlePrefs,
  Preferences,
  ArticleQuickItem,
  ArticleRequestState,
  Account,
} from '@ts/types';
import { AnimatingHeader, ErrorMessage, TabChipList, GroupsBanner } from '@components/index';
import { updateArticles, searchArticles } from '@redux/actions/api/articles';
import getStyles from '@styles/Styles';

import ArticleListCard from '../components/Card';
import ArticleEmptyList from '../components/EmptyList';
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

type ArticleListProps = StackScreenProps<HomeTwoNavParams, 'Article'> & {
  articles: (ArticlePreload | Article)[];
  search: ArticlePreload[];
  lists: ArticleListItem[];
  read: ArticleReadItem[];
  quicks: ArticleQuickItem[];
  articlePrefs: ArticlePrefs;
  preferences: Preferences;
  state: ArticleRequestState;
  account: Account;
};

const ArticleList: React.FC<ArticleListProps> = ({
  navigation,
  route,
  articles,
  search,
  lists,
  read,
  quicks,
  state,
  articlePrefs,
  preferences,
  account,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const scrollY = new Animated.Value(0);

  const potentialCategories = [
    {
      key: 'all',
      title: 'Tous',
      data: articles,
      type: 'category',
    },
  ];

  if (preferences.history) {
    potentialCategories.unshift({
      key: 'unread',
      title: 'Non lus',
      data: articles.filter((a) => !read.some((r) => r.id === a._id)),
      type: 'category',
    });
  }

  const categories: Category[] = [];

  articlePrefs.categories?.forEach((c) => {
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

  const [tab, setTab] = React.useState(route.params?.initialList || tabGroups[0].data[0].key);
  const [chipTab, setChipTab] = React.useState(tab);

  const getSection = (tabKey?: string) =>
    tabGroups.find((t) => t.data.some((d) => d.key === (tabKey ?? tab)))!;
  const getCategory = (tabKey?: string) =>
    getSection(tabKey).data.find((d) => d.key === (tabKey ?? tab))!;

  const section = getSection();
  const category = getCategory();

  useFocusEffect(
    React.useCallback(() => {
      updateArticles('initial');
    }, [null]),
  );

  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const changeList = async (tabKey: string) => {
    const noAnimation =
      Platform.OS !== 'web' ? await AccessibilityInfo.isReduceMotionEnabled() : false;
    const newSection = getSection(tabKey);
    const newCategory = getCategory(tabKey);

    if (noAnimation) {
      setChipTab(tabKey);
      if (newSection.key === 'quicks') {
        searchArticles('initial', '', newCategory.params, false, false);
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
          await searchArticles('initial', '', newCategory.params, false, false);
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
        title="Actus"
        actions={[
          {
            icon: 'magnify',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Search',
                params: {
                  screen: 'Search',
                  params: { initialCategory: 'articles', previous: 'Actus' },
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
                  screen: 'Article',
                },
              }),
          },
          {
            title: 'Localisation',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Params',
                params: {
                  screen: 'Article',
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
                        screen: 'Article',
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
              what: 'la récupération des articles',
              contentPlural: 'des articles',
              contentSingular: "La liste d'articles",
            }}
            error={[state.list.error, state.search?.error]}
            retry={() => updateArticles('initial')}
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
          if (section.key === 'categories') {
            updateArticles('refresh');
          } else if (section.key === 'quicks') {
            searchArticles('refresh', '', category.params, false, false);
          }
        }}
        onEndReached={() => {
          if (section.key === 'categories') {
            updateArticles('next');
          } else if (section.key === 'quicks') {
            console.log(category.params);
            searchArticles('next', '', category.params, false, false);
          }
        }}
        ListHeaderComponent={() => (
          <View>
            <GroupsBanner />
            <TabChipList
              sections={tabGroups}
              selected={chipTab}
              setSelected={changeList}
              configure={() =>
                navigation.navigate('Main', {
                  screen: 'Configure',
                  params: {
                    screen: 'Article',
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
            <ArticleEmptyList
              tab={tab}
              sectionKey={section.key}
              reqState={state}
              navigation={navigation}
              changeTab={changeList}
            />
          </Animated.View>
        )}
        onEndReachedThreshold={0.5}
        keyExtractor={(article: Article) => article._id}
        ListFooterComponent={
          <View style={[styles.container, { height: 50 }]}>
            {((section.key === 'categories' && state.list.loading.next) ||
              (section.key === 'quicks' && state.search.loading.next)) && (
              <ActivityIndicator size="large" color={colors.primary} />
            )}
          </View>
        }
        renderItem={({ item: article }: { item: Article }) => (
          <Animated.View style={{ opacity: fadeAnim }}>
            <ArticleListCard
              article={article}
              sectionKey={section.key}
              itemKey={category.key}
              isRead={read.some((r) => r.id === article._id)}
              historyActive={preferences.history}
              lists={lists}
              navigate={() =>
                navigation.navigate('Main', {
                  screen: 'Display',
                  params: {
                    screen: 'Article',
                    params: {
                      screen: 'Display',
                      params: {
                        id: article._id,
                        title: article.title,
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
      {account.loggedIn && account.permissions?.some((p) => p.permission === 'article.add') && (
        <FAB
          icon="pencil"
          onPress={() =>
            navigation.navigate('Main', {
              screen: 'Add',
              params: {
                screen: 'Article',
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
  const { articles, articleData, preferences, account } = state;
  return {
    articles: articles.data,
    search: articles.search,
    articlePrefs: articleData.prefs,
    lists: articleData.lists,
    quicks: articleData.quicks,
    read: articleData.read,
    state: articles.state,
    account,
    preferences,
  };
};

export default connect(mapStateToProps)(ArticleList);
