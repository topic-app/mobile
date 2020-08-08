import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, useTheme, ProgressBar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import {
  State,
  ArticlePreload,
  Account,
  GroupRolePermission,
  ArticleRequestState,
} from '@ts/types';
import { CustomTabView, ChipAddList, ErrorMessage } from '@components/index';
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

  const allowedGroups = account.permissions.reduce(
    (groups: GroupRolePermission[], p: GroupRolePermission) => {
      if (p.permission === 'article.verification.view') {
        return [...groups, ...(p.scope.self ? [p.group] : []), ...p.scope.groups];
      } else {
        return groups;
      }
    },
    [],
  );
  const [selectedGroups, setSelectedGroups] = React.useState(allowedGroups);
  const [everywhere, setEverywhere] = React.useState(false);

  const fetch = () => updateArticlesVerification('initial', { groups: selectedGroups });

  React.useEffect(() => {
    fetch();
  }, []);

  console.log(JSON.stringify(selectedGroups));

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
            {
              key: 'articles',
              title: 'Articles',
              component: (
                <View>
                  <ChipAddList
                    setList={(data) => console.log(data)}
                    data={[
                      { key: 'everywhere', title: 'Tous (France entière)' },
                      ...allowedGroups.map((g) => ({
                        key: g,
                        title:
                          account.groups?.find((h) => h._id === g)?.shortName ||
                          account.groups?.find((h) => h._id === g)?.name,
                      })),
                    ]}
                    keyList={selectedGroups}
                  />
                  <Text>{JSON.stringify(articlesVerification)}</Text>
                </View>
              ),
            },
            {
              key: 'events',
              title: 'Evenements',
              component: <Text>Hello</Text>,
            },
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
