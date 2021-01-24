import React from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { CategoriesList, PlatformIconButton, Modal, ErrorMessage } from '@components/index';
import { Config, Permissions } from '@constants/index';
import getStyles from '@styles/Styles';
import { ModalProps, State, Account, CommentRequestState, Publisher, Content } from '@ts/types';
import { useTheme, logger, checkPermission, trackEvent } from '@utils/index';

import getArticleStyles from './styles/Styles';

type CommentPublisher = {
  key: string;
  title: string;
  icon: string;
  publisher: {
    type: 'user' | 'group';
    group?: string;
  };
  type: 'category';
};

type AddCommentModalProps = ModalProps & {
  id: string;
  account: Account;
  replyingToComment: string | null;
  setReplyingToComment: (id: string | null) => any;
  replyingToUsername?: string;
  reqState: { comments: CommentRequestState };
  group?: string;
  add: (
    publisher: { type: 'user' | 'group'; user?: string | null; group?: string | null },
    content: Content,
    parent: string,
    isReplying: boolean,
  ) => any;
};

const AddCommentModal: React.FC<AddCommentModalProps> = ({
  visible,
  setVisible,
  account,
  reqState,
  id,
  add,
  replyingToComment,
  setReplyingToComment,
  replyingToUsername,
  group,
}) => {
  const theme = useTheme();
  const articleStyles = getArticleStyles(theme);
  const styles = getStyles(theme);
  const { colors } = theme;

  const [commentText, setCommentText] = React.useState('');
  const [publisher, setPublisher] = React.useState('user');
  const tooManyChars = commentText.length > Config.content.comments.maxCharacters;

  let commentCharCountColor = colors.softContrast;
  if (tooManyChars) {
    commentCharCountColor = colors.error;
  } else if (commentText.length > 0.9 * Config.content.comments.maxCharacters) {
    commentCharCountColor = colors.warning;
  }

  const publishers: CommentPublisher[] = [];
  if (account.loggedIn) {
    publishers.push({
      key: 'user',
      title: account.accountInfo?.user?.info?.username,
      icon: 'account',
      publisher: {
        type: 'user',
      },
      type: 'category',
    });
    account.groups?.forEach((g) => {
      if (
        checkPermission(
          account,
          {
            permission: Permissions.COMMENT_ADD,
            scope: { groups: group ? [group] : [] },
          },
          g._id,
        )
      ) {
        publishers.push({
          key: g._id,
          title: g.shortName || g.name,
          icon: 'newspaper',
          publisher: {
            type: 'group',
            group: g._id,
          },
          type: 'category',
        });
      }
    });
  }

  const submitComment = () => {
    if (account.loggedIn) {
      trackEvent('comments:add', {
        props: {
          method: 'modal',
          publishertype: publishers.find((p) => p.key === publisher)!.publisher?.type,
          isReply: replyingToComment ? 'yes' : 'no',
        },
      });
      add(
        publishers.find((p) => p.key === publisher)!.publisher,
        { parser: 'plaintext', data: commentText },
        replyingToComment || id,
        !!replyingToComment,
      )
        .then(() => {
          setCommentText('');
          setVisible(false);
          setReplyingToComment(null);
        })
        .catch((e: any) => logger.warn('Failed to add comment to article', e));
    }
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        {reqState.comments.add.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: "l'ajout du commentaire",
              contentSingular: 'Le commentaire',
            }}
            error={reqState.comments.add.error}
            retry={submitComment}
          />
        )}
        {!!replyingToComment && (
          <View>
            <View style={styles.container}>
              <Text>
                Réponse au commentaire{replyingToUsername ? ' de @' : ''}
                {replyingToUsername}
              </Text>
            </View>
            <Divider />
          </View>
        )}
        <View style={articleStyles.activeCommentContainer}>
          <TextInput
            // TODO: Hook up comments to drafts in redux, so the user sees his comment when he leaves and comes back.
            // Could possibly also hook it up to drafts with the server in the future.
            autoFocus
            placeholder="Écrire un commentaire..."
            placeholderTextColor={colors.disabled}
            style={articleStyles.commentInput}
            multiline
            value={commentText}
            onChangeText={setCommentText}
          />
        </View>
        <Divider style={articleStyles.divider} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, flexGrow: 1 }}>
            <CategoriesList
              categories={publishers}
              selected={publisher}
              setSelected={setPublisher}
            />
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'row',
              marginLeft: 20,
            }}
          >
            <Text style={{ color: commentCharCountColor }}>
              {commentText.length}/{Config.content.comments.maxCharacters}
            </Text>

            {reqState.comments.add.loading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={{ marginHorizontal: 7 }}
              />
            ) : (
              <PlatformIconButton
                color={tooManyChars || commentText.length < 1 ? colors.disabled : colors.primary}
                icon="send"
                onPress={tooManyChars || commentText.length < 1 ? undefined : submitComment}
                style={{ padding: 0 }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return {
    account,
  };
};

export default connect(mapStateToProps)(AddCommentModal);
