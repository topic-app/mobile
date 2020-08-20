import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Text, useTheme, ProgressBar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import {
  State,
  ArticlePreload,
  Account,
  GroupRolePermission,
  ArticleRequestState,
  Article,
} from '@ts/types';
import { CustomTabView, ChipAddList, ErrorMessage, ArticleCard } from '@components/index';
import getStyles from '@styles/Styles';
import type { ModerationStackParams } from '../index';
import { updateArticlesVerification } from '@redux/actions/api/articles';
import getModerationStyles from '../styles/Styles';

type Props = {
  navigation: StackNavigationProp<ModerationStackParams, 'List'>;
  articlesVerification: ArticlePreload[];
  account: Account;
  state: ArticleRequestState;
};

const ModerationList: React.FC<Props> = ({ navigation, articlesVerification, account, state }) => {
  const theme = useTheme();
  const moderationStyles = getModerationStyles(theme);
  const styles = getStyles(theme);

  if (!account.loggedIn) {
    return <Text>Non autorisé</Text>;
  }

  const allowedGroupsArticle = account.permissions.reduce(
    (groups: GroupRolePermission[], p: GroupRolePermission) => {
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

  const fetch = () => updateArticlesVerification('initial', { groups: selectedGroupsArticle });

  React.useEffect(() => {
    fetch();
  }, [null]);

  console.log(JSON.stringify(selectedGroupsArticle));

  return (
    <View style={styles.page}>
      {state.verification_list?.loading.initial && <ProgressBar indeterminate />}
      {state.verification_list?.error && (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'la récupération des contenus à vérifier',
            contentSingular: 'La liste de contenus',
          }}
          error={state.verification_list.error}
          retry={fetch}
        />
      )}
      <ScrollView>
        <CustomTabView
          pages={[
            ...(allowedGroupsArticle.length || allowedEverywhereArticle
              ? [
                  {
                    key: 'articles',
                    title: 'Articles',
                    component: (
                      <View>
                        <ChipAddList
                          setList={(data) => console.log(data)}
                          data={[
                            ...(allowedEverywhereArticle
                              ? [{ key: 'everywhere', title: 'Tous (France entière)' }]
                              : []),
                            ...allowedGroupsArticle.map((g: string) => ({
                              key: g,
                              title:
                                account.groups?.find((h) => h._id === g)?.shortName ||
                                account.groups?.find((h) => h._id === g)?.name,
                            })),
                          ]}
                          keyList={[
                            ...selectedGroupsArticle,
                            ...(everywhereArticle ? ['everywhere'] : []),
                          ]}
                        />
                        <FlatList
                          data={articlesVerification}
                          keyExtractor={(i) => i._id}
                          ListEmptyComponent={
                            <View style={styles.centerIllustrationContainer}>
                              <Text>Aucun article en attente de modération</Text>
                            </View>
                          }
                          renderItem={({ item }: { item: Article }) => (
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
                    ),
                  },
                ]
              : []),
          ]}
        />
      </ScrollView>
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

export default connect(mapStateToProps)(ModerationList);
