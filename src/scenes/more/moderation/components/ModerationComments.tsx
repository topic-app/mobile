import React from 'react';
import { View, FlatList } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { ErrorMessage } from '@components';
import { updateCommentsVerification } from '@redux/actions/api/comments';
import getStyles from '@styles/global';
import { State, Account, CommentRequestState, Comment, ModerationTypes } from '@ts/types';

import type { ModerationScreenNavigationProp } from '..';
import CommentItem from '../../../display/components/Comment';

type Props = {
  navigation: ModerationScreenNavigationProp<'List'>;
  commentsVerification: Comment[];
  account: Account;
  state: CommentRequestState;
  type: ModerationTypes;
};

const ModerationArticles: React.FC<Props> = ({
  navigation,
  commentsVerification,
  account,
  state,
  type,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const fetch = () => updateCommentsVerification('initial', { type });

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
          data={commentsVerification}
          keyExtractor={(i) => i._id}
          ListEmptyComponent={
            state.verification_list?.loading?.initial ? null : (
              <View style={[styles.centerIllustrationContainer, { marginTop: 40 }]}>
                <Text>Aucun commentaire</Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <CommentItem
                comment={item}
                report={() => {}}
                navigation={navigation}
                loggedIn={account.loggedIn}
                reply={() => {}}
                isReply={false}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { comments, account } = state;
  return {
    commentsVerification: comments.verification,
    account,
    state: comments.state,
  };
};

export default connect(mapStateToProps)(ModerationArticles);
