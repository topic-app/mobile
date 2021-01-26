import moment from 'moment';
import React from 'react';
import { View, Platform, TouchableOpacity, Alert } from 'react-native';
import { Text, IconButton, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { Avatar, Content } from '@components/index';
import { Permissions } from '@constants/index';
import { commentDelete } from '@redux/actions/apiActions/comments';
import getStyles from '@styles/Styles';
import { Comment, Account, State, CommentReply } from '@ts/types';
import { checkPermission, Errors, useTheme } from '@utils/index';
import { NativeStackNavigationProp } from '@utils/stack';

import getCommentStyles from './styles/Styles';

type CommentInlineCardPropsBase = {
  report: (id: string) => void;
  account: Account;
  fetch?: () => void;
  loggedIn: boolean;
  navigation: NativeStackNavigationProp<any, any>;
  reply: (id: string | null) => void;
  authors?: string[];
};
type CommentInlineCardPropsComment = CommentInlineCardPropsBase & {
  isReply: false;
  comment: Comment;
};
type CommentInlineCardPropsReply = CommentInlineCardPropsBase & {
  isReply: true;
  comment: CommentReply;
};
type CommentInlineCardProps = CommentInlineCardPropsReply | CommentInlineCardPropsComment;

const CommentInlineCard: React.FC<CommentInlineCardProps> = ({
  comment,
  report,
  isReply = false,
  fetch = () => {},
  account,
  loggedIn,
  navigation,
  reply,
  authors,
}) => {
  const { publisher, content, date, _id: id } = comment;
  const { displayName } = publisher
    ? publisher[publisher.type] || {}
    : { displayName: 'Auteur inconnu' };

  const theme = useTheme();
  const styles = getStyles(theme);
  const commentStyles = getCommentStyles(theme);
  const { colors } = theme;

  const navigateToPublisher = () =>
    navigation.navigate('Main', {
      screen: 'Display',
      params: {
        screen: comment.publisher?.type === 'user' ? 'User' : 'Group',
        params: {
          screen: 'Display',
          params: {
            id:
              comment.publisher?.type === 'user'
                ? comment.publisher?.user?._id
                : comment.publisher?.group?._id,
          },
        },
      },
    });

  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);

  const canDelete =
    publisher?.type === 'user'
      ? (publisher?.user?._id === account.accountInfo?.accountId && account.loggedIn) ||
        checkPermission(account, {
          permission: Permissions.COMMENT_DELETE,
          scope: { everywhere: true },
        })
      : checkPermission(account, {
          permission: Permissions.COMMENT_DELETE,
          scope: { groups: [publisher?.group?._id || ''] },
        });

  const deleteComment = () =>
    commentDelete(id, publisher)
      .then(fetch)
      .catch((error) =>
        Errors.showPopup({
          type: 'axios',
          what: 'la suppression du commentaire',
          error,
          retry: deleteComment,
        }),
      );

  if (!id || !content) return null;

  return (
    <View style={styles.container}>
      <View style={[{ flexDirection: 'row' }, isReply ? { marginLeft: 20 } : {}]}>
        {}
        <Avatar
          avatar={
            publisher?.type === 'user' ? publisher?.user?.info?.avatar : publisher?.group?.avatar
          }
          size={40}
          onPress={navigateToPublisher}
        />
        <View style={{ paddingLeft: 10, flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              activeOpacity={Platform.OS === 'ios' ? 0.2 : 0.6}
              onPress={navigateToPublisher}
            >
              <Text
                style={[
                  commentStyles.username,
                  comment.publisher?.user?._id === account.accountInfo?.accountId
                    ? { color: colors.primary }
                    : {},
                ]}
              >
                {isReply ? 'Réponse de ' : ''}
                {displayName}{' '}
                {publisher?.group?.official && (
                  <Icon name="check-decagram" color={colors.primary} size={12} />
                )}
                {authors &&
                  (authors.includes(publisher?.group?._id || '') ||
                    authors.includes(publisher?.user?._id || '')) && (
                    <Icon name="account-edit" color={colors.primary} size={12} />
                  )}
              </Text>
            </TouchableOpacity>
            <Text style={commentStyles.username}> · {moment(date).fromNow()}</Text>
          </View>
          <Content data={content.data} parser={content.parser} />
        </View>
        {loggedIn && (
          <View style={{ alignItems: 'flex-end' }}>
            <Menu
              visible={menuVisible === 'main'}
              onDismiss={() => setMenuVisible(null)}
              anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible('main')} />}
            >
              <Menu.Item onPress={() => reply(id)} title="Répondre" />
              <Menu.Item onPress={() => report(id)} title="Signaler" />
              {canDelete ? (
                <Menu.Item
                  onPress={() =>
                    Alert.alert(
                      'Voulez vous vraiment supprimer ce commentaire ?',
                      'Cette action est irréversible',
                      [{ text: 'Annuler' }, { text: 'Supprimer', onPress: deleteComment }],
                      { cancelable: true },
                    )
                  }
                  title="Supprimer"
                />
              ) : null}
            </Menu>
          </View>
        )}
      </View>
    </View>
  );
};

const CommentItem: React.FC<CommentInlineCardPropsComment> = (props) => {
  const { comment } = props;
  return (
    <View>
      <CommentInlineCard {...props} />
      {!!comment?.cache?.replies &&
        comment.cache.replies.map((c) => {
          return <CommentInlineCard {...props} comment={c} isReply />;
        })}
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, comments } = state;
  return {
    account,
  };
};

export default connect(mapStateToProps)(CommentItem);
