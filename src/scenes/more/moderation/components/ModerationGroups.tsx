import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { Text, useTheme, ProgressBar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';

import {
  State,
  GroupPreload,
  Account,
  GroupRolePermission,
  GroupRequestState,
  Group,
} from '@ts/types';
import {
  CustomTabView,
  ChipAddList,
  ErrorMessage,
  ArticleCard,
  TranslucentStatusBar,
  CustomHeaderBar,
  GroupCard,
} from '@components/index';
import getStyles from '@styles/Styles';
import { updateGroupsVerification } from '@redux/actions/api/groups';

import type { ModerationStackParams } from '../index';
import getModerationStyles from '../styles/Styles';

type Props = {
  navigation: StackNavigationProp<ModerationStackParams, 'List'>;
  articlesVerification: GroupPreload[];
  account: Account;
  state: GroupRequestState;
};

const ModerationArticles: React.FC<Props> = ({
  navigation,
  groupsVerification,
  account,
  state,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const fetch = () => updateGroupsVerification('initial', {});

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
            what: 'la récupération des groupes à vérifier',
            contentSingular: 'La liste de groupes à vérifier',
            contentPlural: 'Les groupes à vérifier',
          }}
          error={state.verification_list.error}
          retry={fetch}
        />
      )}
      <View>
        <FlatList
          data={groupsVerification}
          keyExtractor={(i) => i._id}
          ListEmptyComponent={
            state.verification_list?.loading?.initial ? null : (
              <View style={[styles.centerIllustrationContainer, { marginTop: 40 }]}>
                <Text>
                  Aucun groupe en attente de modération, donc voila un petit easter egg: &#129370;
                </Text>
              </View>
            )
          }
          renderItem={({ item }: { item: Group }) => (
            <View>
              <GroupCard
                group={item}
                unread
                verification
                navigate={() =>
                  navigation.navigate('Main', {
                    screen: 'Display',
                    params: {
                      screen: 'Group',
                      params: {
                        screen: 'Display',
                        params: {
                          id: item._id,
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
  const { groups, account } = state;
  return {
    groupsVerification: groups.verification,
    account,
    state: groups.state,
  };
};

export default connect(mapStateToProps)(ModerationArticles);
