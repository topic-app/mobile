import React from 'react';
import { ModalProps, State, ArticleListItem, Account } from '@ts/types';
import { Divider, Button, Text, Card, useTheme } from 'react-native-paper';
import { View, Platform, TextInput, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { config } from '@root/app.json';

import { CollapsibleView, CategoriesList, PlatformIconButton } from '@components/index';
import getStyles from '@styles/Styles';
import getArticleStyles from './styles/Styles';
import { logger } from '@root/src/utils';

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
};

function AddCommentModal({
  visible,
  setVisible,
  account,
  reqState,
  id,
  add,
}: AddCommentModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);
  const { colors } = theme;

  const [commentText, setCommentText] = React.useState('');
  const [publisher, setPublisher] = React.useState('user');
  const tooManyChars = commentText.length > config.comments.maxCharacters;

  let commentCharCountColor = colors.softContrast;
  if (tooManyChars) {
    commentCharCountColor = colors.error;
  } else if (commentText.length > 0.9 * config.comments.maxCharacters) {
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
    account.groups?.forEach((g) =>
      publishers.push({
        key: g._id,
        title: g.shortName || g.name,
        icon: 'newspaper',
        publisher: {
          type: 'group',
          group: g._id,
        },
        type: 'category',
      }),
    );
  }

  const submitComment = () => {
    if (account.loggedIn) {
      add(
        publishers.find((p) => p.key === publisher)!.publisher,
        { parser: 'plaintext', data: commentText },
        id,
        'article',
      )
        .then(() => {
          setCommentText('');
          setVisible(false);
        })
        .catch((e) => logger.error('Failed to add comment to article', e));
    }
  };

  return (
    <Modal
      isVisible={visible}
      avoidKeyboard
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      onSwipeComplete={() => setVisible(false)}
      swipeDirection={['down']}
      style={styles.bottomModal}
    >
      <Card>
        {reqState.comments.add.error && (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'l&apos;ajout du commentaire',
              contentSingular: 'Le commentaire',
            }}
            error={reqState.comments.add.error}
            retry={submitComment}
          />
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
          <View>
            <CategoriesList
              categories={publishers}
              selected={publisher}
              setSelected={setPublisher}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Text style={{ color: commentCharCountColor }}>
              {commentText.length}/{config.comments.maxCharacters}
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
      </Card>
    </Modal>
  );
}

const mapStateToProps = (state: State) => {
  const { account } = state;
  return {
    account,
  };
};

export default connect(mapStateToProps)(AddCommentModal);
