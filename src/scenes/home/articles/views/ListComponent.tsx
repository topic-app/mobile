import React from 'react';
import { View, Animated } from 'react-native';
import { FAB } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  ErrorMessage,
  GroupsBanner,
  ARTICLE_CARD_HEADER_HEIGHT,
  VerificationBanner,
  ContentFlatList,
  ContentSection,
} from '@components/index';
import { Permissions } from '@constants/index';
import {
  updateArticles,
  searchArticles,
  updateArticlesFollowing,
  clearArticles,
} from '@redux/actions/api/articles';
import getStyles from '@styles/Styles';
import {
  State,
  ArticleListItem,
  ArticleReadItem,
  ArticlePreload,
  ArticlePrefs,
  ArticleQuickItem,
  ArticleRequestState,
  Account,
  AnyArticle,
} from '@ts/types';
import { checkPermission, useTheme } from '@utils/index';

import ArticleListCard from '../components/Card';
import ArticleEmptyList from '../components/EmptyList';

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
  initialTabKey,
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
          clearArticles(false, true, false, false);
        }
        await searchArticles(loadType, '', params, false, false);
      },
    });
  });

  React.useEffect(() => {
    updateArticles('initial');
    updateArticlesFollowing('initial');
  }, [null]);

  const [cardWidth, setCardWidth] = React.useState(100);
  const imageSize = cardWidth / 3.5;

  const itemHeight = ARTICLE_CARD_HEADER_HEIGHT + imageSize;

  return (
    <View
      style={styles.page}
      onLayout={({ nativeEvent }) => setCardWidth(nativeEvent.layout.width)}
    >
      <ContentFlatList
        scrollY={scrollY}
        initialSection={initialTabKey}
        sections={sections}
        keyExtractor={(article) => article._id}
        renderItem={({ item: article, sectionKey, group }) => (
          <ArticleListCard
            article={article}
            group={group}
            sectionKey={sectionKey}
            isRead={read.some((r) => r.id === article._id)}
            historyActive={historyEnabled}
            lists={lists}
            overrideImageWidth={imageSize}
            navigate={() =>
              onArticlePress({
                id: article._id,
                title: article.title,
                useLists: group === 'lists',
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
                    what: 'la récupération des articles',
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
