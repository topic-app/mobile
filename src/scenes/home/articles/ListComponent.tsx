import React from 'react';
import { View, Animated } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  ErrorMessage,
  GroupsBanner,
  ARTICLE_CARD_HEIGHT,
  VerificationBanner,
  ContentFlatList,
  ContentSection,
} from '@components';
import {
  updateArticles,
  searchArticles,
  updateArticlesFollowing,
  clearArticles,
} from '@redux/actions/api/articles';
import getStyles from '@styles/global';
import {
  State,
  ArticleReadItem,
  ArticlePreload,
  ArticlePrefs,
  ArticleQuickItem,
  ArticleRequestState,
  Account,
  AnyArticle,
} from '@ts/types';
import { checkPermission, Permissions } from '@utils';

import ArticleListCard from './components/Card';
import ArticleEmptyList from './components/EmptyList';

type ArticleListComponentProps = {
  scrollY: Animated.Value;
  onArticlePress: (article: { id: string; title: string }) => any;
  onConfigurePressed?: () => void;
  onArticleCreatePressed: () => void;
  historyEnabled: boolean;
  initialTabKey?: string;
  articles: ArticlePreload[];
  followingArticles: ArticlePreload[];
  search: ArticlePreload[];
  read: ArticleReadItem[];
  quicks: ArticleQuickItem[];
  articlePrefs: ArticlePrefs;
  state: ArticleRequestState;
  account: Account;
  blocked: string[];
};

const ArticleListComponent: React.FC<ArticleListComponentProps> = ({
  scrollY,
  articles,
  followingArticles,
  search,
  read,
  quicks,
  state,
  articlePrefs,
  historyEnabled,
  account,
  onArticlePress,
  onConfigurePressed,
  onArticleCreatePressed,
  initialTabKey,
  blocked,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const sections: ContentSection<AnyArticle>[] = [];

  articlePrefs.categories?.forEach((categKey) => {
    const categCommon: Partial<ContentSection<AnyArticle>> = {
      group: 'categories',
      loading: state.list.loading,
      onLoad: async (loadType) => {
        if (loadType !== 'initial') {
          await updateArticles(loadType);
        }
      },
    };
    if (categKey === 'all') {
      sections.push({
        key: 'all',
        title: 'Tous',
        data: articles,
        ...categCommon,
      });
    } else if (categKey === 'unread' && historyEnabled) {
      sections.push({
        key: 'unread',
        title: 'Non lus',
        data: articles.filter((a) => !read.some((r) => r.id === a._id)),
        ...categCommon,
      });
    } else if (categKey === 'following' && account.loggedIn) {
      const { users, groups } = account.accountInfo.user.data.following;
      if (users.length + groups.length > 0) {
        sections.push({
          key: 'following',
          title: 'Suivis',
          data: followingArticles,
          ...categCommon,
          onLoad: async (loadType) => {
            if (loadType !== 'initial') {
              await updateArticlesFollowing(loadType);
            }
          },
          loading: state.following?.loading,
        });
      }
    }
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
          clearArticles(false, true, false, false, false);
        }
        await searchArticles(loadType, '', params, false, false);
      },
    });
  });

  React.useEffect(() => {
    updateArticles('initial');
    updateArticlesFollowing('initial');
  }, [null]);

  const itemHeight = ARTICLE_CARD_HEIGHT;

  return (
    <View style={styles.page}>
      <ContentFlatList
        scrollY={scrollY}
        initialSection={initialTabKey}
        sections={sections}
        keyExtractor={(article) => article._id}
        renderItem={({ item: article, sectionKey, group }) => (
          <ArticleListCard
            article={article}
            sectionKey={sectionKey}
            isRead={read.some((r) => r.id === article._id)}
            historyActive={historyEnabled}
            navigate={() =>
              onArticlePress({
                id: article._id,
                title: article.title,
              })
            }
          />
        )}
        itemHeight={itemHeight}
        ListHeaderComponent={({ sectionKey, group, retry }) => {
          return (
            <View>
              <GroupsBanner />
              <VerificationBanner />
              {(state.list.error && group === 'categories') ||
              (state.search?.error && group === 'quicks') ||
              (state.following?.error && group === 'categories' && sectionKey === 'following') ? (
                <ErrorMessage
                  type="axios"
                  strings={{
                    what: 'la r??cup??ration des articles',
                    contentPlural: 'des articles',
                    contentSingular: "La liste d'articles",
                  }}
                  error={[state.list.error, state.search?.error, state.following?.error]}
                  retry={retry}
                />
              ) : null}
            </View>
          );
        }}
        ListEmptyComponent={(props) => <ArticleEmptyList reqState={state} {...props} />}
        onConfigurePress={onConfigurePressed}
        blocked={blocked}
      />
      {checkPermission(account, {
        permission: Permissions.ARTICLE_ADD,
        scope: {},
      }) && (
        <FAB
          icon="pencil"
          onPress={onArticleCreatePressed}
          style={styles.bottomRightFab}
          accessibilityLabel="??crire un article"
        />
      )}
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
    quicks: articleData.quicks,
    read: articleData.read,
    state: articles.state,
    account,
    historyEnabled: preferences.history,
    blocked: preferences.blocked,
  };
};

export default connect(mapStateToProps)(ArticleListComponent);
