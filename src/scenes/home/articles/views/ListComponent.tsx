import React from 'react';
import { View, Animated, ActivityIndicator, AccessibilityInfo, Platform } from 'react-native';
import { ProgressBar, FAB, Subheading, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  ErrorMessage,
  TabChipList,
  GroupsBanner,
  ARTICLE_CARD_HEADER_HEIGHT,
  Banner,
  VerificationBanner,
} from '@components/index';
import { Permissions } from '@constants/index';
import {
  updateArticles,
  searchArticles,
  updateArticlesFollowing,
} from '@redux/actions/api/articles';
import getStyles from '@styles/Styles';
import {
  State,
  ArticleListItem,
  ArticleReadItem,
  ArticlePreload,
  Article,
  ArticlePrefs,
  ArticleQuickItem,
  ArticleRequestState,
  Account,
} from '@ts/types';
import { checkPermission, useTheme } from '@utils/index';

import ArticleListCard from '../components/Card';
import ArticleEmptyList from '../components/EmptyList';

type Category = {
  key: string;
  title: string;
  description?: string;
  data: any[];
  type: string;
  list?: boolean;
  params?: object;
};

type ArticleListComponentProps = {
  scrollY: Animated.Value;
  onArticlePress: (article: { id: string; title: string; useLists: boolean }) => any;
  onConfigurePressed?: () => void;
  onArticleCreatePressed: () => void;
  historyEnabled: boolean;
  initialTabKey?: string;
  articles: ArticlePreload[];
  followingArticles: ArticlePreload[];
  search: ArticlePreload[];
  lists: ArticleListItem[];
  read: ArticleReadItem[];
  quicks: ArticleQuickItem[];
  articlePrefs: ArticlePrefs;
  state: ArticleRequestState;
  account: Account;
};

const ArticleListComponent: React.FC<ArticleListComponentProps> = ({
  scrollY,
  initialTabKey,
  articles,
  followingArticles,
  search,
  lists,
  read,
  quicks,
  state,
  articlePrefs,
  historyEnabled,
  account,
  onArticlePress,
  onConfigurePressed,
  onArticleCreatePressed,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const categories: Category[] = [];

  articlePrefs.categories?.forEach((catKey) => {
    if (catKey === 'all') {
      categories.push({
        key: 'all',
        title: 'Tous',
        data: articles,
        type: 'category',
      });
    } else if (catKey === 'unread' && historyEnabled) {
      categories.push({
        key: 'unread',
        title: 'Non lus',
        data: articles.filter((a) => !read.some((r) => r.id === a._id)),
        type: 'category',
      });
    } else if (catKey === 'following' && account.loggedIn) {
      const { users, groups } = account.accountInfo.user.data.following;
      if (users.length + groups.length > 0) {
        categories.push({
          key: 'following',
          title: 'Suivis',
          data: followingArticles,
          type: 'category',
        });
      }
    }
  });

  const tabGroups: Record<'categories' | 'lists' | 'quicks', Category[]> = {
    categories,
    lists: lists.map((l) => ({
      key: l.id,
      title: l.name,
      description: l.description,
      icon: l.icon,
      data: l.items,
      list: true,
      type: 'list',
    })),
    quicks: quicks.map((q) => {
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
  };

  // Transforms tabGroups into array of Category with added 'section' key
  const tabs = Object.entries(tabGroups).flatMap(([sectionName, categs]) =>
    categs.map((cat) => ({ ...cat, section: sectionName })),
  );

  const [chipTab, setChipTab] = React.useState(
    initialTabKey ||
      tabGroups.categories[0]?.key ||
      tabGroups.lists[0]?.key ||
      tabGroups.quicks[0]?.key,
  );
  const [dataLoaded, setDataLoaded] = React.useState(true);

  const getSection = (tabKey: string) => tabs.find((t) => t.key === tabKey)!.section;
  const getCategory = (tabKey: string) => tabs.find((t) => t.key === tabKey)!;

  React.useEffect(() => {
    updateArticles('initial');
    updateArticlesFollowing('initial');
  }, [null]);

  const changeList = async (tabKey: string) => {
    const noAnimation =
      Platform.OS !== 'web' ? await AccessibilityInfo.isReduceMotionEnabled() : false;

    const newSection = getSection(tabKey);
    const newCategory = getCategory(tabKey);

    if (noAnimation) {
      setChipTab(tabKey);
      setDataLoaded(false);
      if (newSection === 'quicks') {
        await searchArticles('initial', '', newCategory.params, false, false);
      }
      setDataLoaded(true);
    } else {
      setChipTab(tabKey);
      setDataLoaded(false);
      Animated.timing(fadeAnim, {
        useNativeDriver: true,
        toValue: 0,
        duration: 100,
      }).start(async () => {
        if (newSection === 'quicks') {
          await searchArticles('initial', '', newCategory.params, false, false);
        }
        setDataLoaded(true);
        Animated.timing(fadeAnim, {
          useNativeDriver: true,
          toValue: 1,
          duration: 100,
        }).start();
      });
    }
  };

  const section = getSection(chipTab);
  const category = getCategory(chipTab);
  const listData = dataLoaded ? category.data : [];

  const [cardWidth, setCardWidth] = React.useState(100);
  const imageSize = cardWidth / 3.5;

  const itemHeight = ARTICLE_CARD_HEADER_HEIGHT + imageSize;

  const getItemLayout = (data: unknown, index: number) => {
    return { length: itemHeight, offset: itemHeight * index, index };
  };

  return (
    <View
      style={styles.page}
      onLayout={({ nativeEvent }) => setCardWidth(nativeEvent.layout.width)}
    >
      {(state.list.loading.initial ||
        state.search?.loading.initial ||
        state.following?.loading.initial) && (
        <ProgressBar indeterminate style={{ marginTop: -4 }} />
      )}
      {(state.list.error && section === 'categories') ||
      (state.search?.error && section === 'quicks') ||
      (state.following?.error && section === 'categories' && chipTab === 'following') ? (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'la récupération des articles',
            contentPlural: 'des articles',
            contentSingular: "La liste d'articles",
          }}
          error={[state.list.error, state.search?.error, state.following?.error]}
          retry={() => updateArticles('initial')}
        />
      ) : null}
      <Animated.FlatList<Article>
        //        Note: ↑ this is a TypeScript Generic, not a React component
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        data={listData}
        refreshing={
          (section === 'categories' && state.list.loading.refresh) ||
          (section === 'quicks' && state.search?.loading.refresh)
        }
        onRefresh={() => {
          if (section === 'categories') {
            updateArticles('refresh');
          } else if (section === 'quicks') {
            searchArticles('refresh', '', category.params, false, false);
          }
        }}
        onEndReached={() => {
          if (section === 'categories') {
            updateArticles('next');
          } else if (section === 'quicks') {
            searchArticles('next', '', category.params, false, false);
          }
        }}
        getItemLayout={getItemLayout}
        ListHeaderComponent={() => (
          <View>
            <GroupsBanner />
            <VerificationBanner />
            <TabChipList
              sections={Object.entries(tabGroups).map(([key, data]) => ({ key, data }))}
              selected={chipTab}
              setSelected={changeList}
              configure={onConfigurePressed}
            />
            {category.description ? (
              <Banner actions={[]} visible>
                <Subheading>Description{'\n'}</Subheading>
                <Text>{category.description}</Text>
              </Banner>
            ) : null}
          </View>
        )}
        ListEmptyComponent={() => (
          <Animated.View>
            {dataLoaded ? (
              <ArticleEmptyList
                tab={chipTab}
                sectionKey={section}
                reqState={state}
                changeTab={changeList}
              />
            ) : null}
          </Animated.View>
        )}
        onEndReachedThreshold={0.5}
        keyExtractor={(article) => article._id}
        ListFooterComponent={
          <View style={[styles.container, { height: 50 }]}>
            {((section === 'categories' && state.list.loading.next) ||
              (section === 'quicks' && state.search?.loading.next)) && (
              <ActivityIndicator size="large" color={colors.primary} />
            )}
          </View>
        }
        renderItem={({ item: article }) => (
          <Animated.View style={{ opacity: fadeAnim }}>
            <ArticleListCard
              article={article}
              sectionKey={section}
              itemKey={category.key}
              isRead={read.some((r) => r.id === article._id)}
              historyActive={historyEnabled}
              lists={lists}
              overrideImageWidth={imageSize}
              navigate={() =>
                onArticlePress({
                  id: article._id,
                  title: article.title,
                  useLists: section === 'lists',
                })
              }
            />
          </Animated.View>
        )}
      />
      {checkPermission(account, {
        permission: Permissions.ARTICLE_ADD,
        scope: {},
      }) && <FAB icon="pencil" onPress={onArticleCreatePressed} style={styles.bottomRightFab} />}
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { articles, articleData, account, preferences } = state;
  return {
    articles: articles.data,
    followingArticles: articles.following,
    search: articles.search,
    articlePrefs: articleData.prefs,
    lists: articleData.lists,
    quicks: articleData.quicks,
    read: articleData.read,
    state: articles.state,
    account,
    historyEnabled: preferences.history,
  };
};

export default connect(mapStateToProps)(ArticleListComponent);
