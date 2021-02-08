import React from 'react';
import { View, FlatList } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import { ErrorMessage, GroupCard } from '@components/index';
import { updateGroupsVerification } from '@redux/actions/api/groups';
import getStyles from '@styles/Styles';
import { State, Account, GroupRequestState, AnyGroup, ModerationTypes } from '@ts/types';
import { useTheme } from '@utils/index';

import type { ModerationScreenNavigationProp } from '../index';

type Props = {
  navigation: ModerationScreenNavigationProp<'List'>;
  groupsVerification: AnyGroup[];
  account: Account;
  state: GroupRequestState;
  type: ModerationTypes;
};

const ModerationArticles: React.FC<Props> = ({
  navigation,
  groupsVerification,
  account,
  state,
  type,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const fetch = () => updateGroupsVerification('initial', { type });

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
                  Aucun groupe en attente de modération, donc voilà un petit easter egg: &#129370;
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <View>
              <GroupCard
                group={item}
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
