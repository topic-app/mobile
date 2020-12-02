import React from 'react';
import { View, FlatList } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import { ChipAddList, ErrorMessage, ArticleCard } from '@components/index';
import { updateArticlesVerification } from '@redux/actions/api/articles';
import getStyles from '@styles/Styles';
import {
  State,
  Account,
  ArticleRequestState,
  AccountPermission,
  ArticleVerificationPreload,
} from '@ts/types';
import { useTheme } from '@utils/index';

import type { ModerationScreenNavigationProp } from '../index';

type Props = {
  navigation: ModerationScreenNavigationProp<'List'>;
  articlesVerification: ArticleVerificationPreload[];
  account: Account;
  state: ArticleRequestState;
};

const ModerationArticles: React.FC<Props> = ({
  navigation,
  articlesVerification,
  account,
  state,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  if (!account.loggedIn) return null;

  const allowedGroupsArticle = account.permissions.reduce(
    (groups: string[], p: AccountPermission) => {
      if (p.permission === 'article.verification.view') {
        return [...groups, ...(p.scope.self ? [p.group] : []), ...p.scope.groups];
      } else {
        return groups;
      }
    },
    [],
  );
  const allowedEverywhereArticle = account.permissions.some(
    (p) => p.permission === 'article.verification.view' && p.scope.everywhere,
  );
  const [selectedGroupsArticle, setSelectedGroupsArticle] = React.useState(allowedGroupsArticle);
  const [everywhereArticle, setEverywhereArticle] = React.useState(false);

  const fetch = (groups = selectedGroupsArticle, everywhere = everywhereArticle) =>
    updateArticlesVerification('initial', everywhere ? {} : { groups });

  React.useEffect(() => {
    fetch();
  }, [null]);

  return (
    <View>
      {state.verification_list?.loading.initial && <ProgressBar indeterminate />}
      {state.verification_list?.error && (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'la récupération des articles à vérifier',
            contentSingular: "La liste d'articles à vérifier",
            contentPlural: 'Les articles à vérifier',
          }}
          error={state.verification_list.error}
          retry={fetch}
        />
      )}
      <View>
        <ChipAddList
          setList={(data) => {
            if (data.key === 'everywhere') {
              setEverywhereArticle(true);
              setSelectedGroupsArticle([]);
              fetch([], true);
            } else {
              if (selectedGroupsArticle.includes(data.key)) {
                setEverywhereArticle(false);
                setSelectedGroupsArticle(selectedGroupsArticle.filter((g) => g !== data.key));
                fetch(
                  selectedGroupsArticle.filter((g) => g !== data.key),
                  false,
                );
              } else {
                setEverywhereArticle(false);
                setSelectedGroupsArticle([...selectedGroupsArticle, data.key]);
                fetch([...selectedGroupsArticle, data.key], false);
              }
            }
          }}
          data={[
            ...(allowedEverywhereArticle
              ? [{ key: 'everywhere', title: 'Tous (France entière)' }]
              : []),
            ...allowedGroupsArticle.map((g: string) => ({
              key: g,
              title:
                account.groups?.find((h) => h._id === g)?.shortName ||
                account.groups?.find((h) => h._id === g)?.name ||
                'Groupe inconnu',
            })),
          ]}
          keyList={[...selectedGroupsArticle, ...(everywhereArticle ? ['everywhere'] : [])]}
        />
        <FlatList
          data={articlesVerification}
          keyExtractor={(i) => i._id}
          ListEmptyComponent={
            state.verification_list?.loading?.initial ? null : (
              <View style={styles.centerIllustrationContainer}>
                <Text>Aucun article en attente de modération</Text>
              </View>
            )
          }
          renderItem={({ item }: { item: ArticleVerificationPreload }) => (
            <View>
              <ArticleCard
                article={item}
                unread
                verification
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
                          verification: true,
                        },
                      },
                    },
                  })
                }
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { articles, account } = state;
  return {
    articlesVerification: articles.verification,
    account,
    state: articles.state,
  };
};

export default connect(mapStateToProps)(ModerationArticles);
