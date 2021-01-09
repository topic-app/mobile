import moment from 'moment';
import React from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { Text, IconButton, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Avatar, Content } from '@components/index';
import getStyles from '@styles/Styles';
import { Comment } from '@ts/types';
import { useTheme } from '@utils/index';
import { NativeStackNavigationProp } from '@utils/stack';

import getCommentStyles from './styles/Styles';

type CommentInlineCardProps = {
  comment: Comment;
  report: (id: string) => any;
  loggedIn: boolean;
  navigation: NativeStackNavigationProp<any, any>;
  reply: (id: string | null) => any;
  authors?: string[];
};

const CommentInlineCard: React.FC<CommentInlineCardProps> = ({
  comment,
  report,
  loggedIn,
  navigation,
  reply,
  authors,
}) => {
  const { publisher, content, date, _id: id } = comment;
  const { displayName } = publisher[publisher.type] || {};

  const theme = useTheme();
  const styles = getStyles(theme);
  const commentStyles = getCommentStyles(theme);
  const { colors } = theme;

  const navigateToPublisher = () =>
    navigation.navigate('Main', {
      screen: 'Display',
      params: {
        screen: comment.publisher.type === 'user' ? 'User' : 'Group',
        params: {
          screen: 'Display',
          params: {
            id:
              comment.publisher.type === 'user'
                ? comment.publisher.user?._id
                : comment.publisher.group?._id,
          },
        },
      },
    });

  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Avatar
          avatar={
            publisher.type === 'user' ? publisher.user?.info?.avatar : publisher.group?.avatar
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
              <Text style={commentStyles.username}>
                {displayName}{' '}
                {publisher.group?.official && (
                  <Icon name="check-decagram" color={colors.primary} size={12} />
                )}
                {authors &&
                  (authors.includes(publisher.group?._id || '') ||
                    authors.includes(publisher.user?._id || '')) && (
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
            </Menu>
          </View>
        )}
      </View>
      {!!comment.cache?.replies && !!comment.cache.replies.length && (
        <View style={{ marginLeft: 20 }}>
          {comment.cache.replies.map((c) => {
            const navigateToReplyPublisher = () =>
              navigation.navigate('Main', {
                screen: 'Display',
                params: {
                  screen: c.publisher.type === 'user' ? 'User' : 'Group',
                  params: {
                    screen: 'Display',
                    params: {
                      id:
                        c.publisher.type === 'user'
                          ? c.publisher.user?._id
                          : c.publisher.group?._id,
                    },
                  },
                },
              });
            return (
              <View style={{ flexDirection: 'row', marginTop: 10 }} key={c._id}>
                <Avatar
                  avatar={
                    c.publisher.type === 'user'
                      ? c.publisher.user?.info?.avatar
                      : c.publisher.group?.avatar
                  }
                  size={40}
                  onPress={navigateToReplyPublisher}
                />
                <View style={{ paddingLeft: 10, flex: 1 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={navigateToReplyPublisher}
                      activeOpacity={Platform.OS === 'ios' ? 0.2 : 0.6}
                    >
                      <Text style={commentStyles.username}>
                        Réponse de {c.publisher[c.publisher.type]?.displayName}{' '}
                        {c.publisher.group?.official && (
                          <Icon name="check-decagram" color={colors.primary} size={12} />
                        )}
                        {authors &&
                          (authors.includes(c.publisher.group?._id || '') ||
                            authors.includes(c.publisher.user?._id || '')) && (
                            <Icon name="account-edit" color={colors.primary} size={12} />
                          )}
                      </Text>
                    </TouchableOpacity>
                    <Text style={commentStyles.username}> · {moment(c.date).fromNow()}</Text>
                  </View>
                  <Content data={c.content.data} parser={c.content.parser} />
                </View>
                {loggedIn && (
                  <View style={{ alignItems: 'flex-end' }}>
                    <Menu
                      visible={menuVisible === c._id}
                      onDismiss={() => setMenuVisible(null)}
                      anchor={
                        <IconButton
                          icon="dots-vertical"
                          color={colors.softContrast}
                          onPress={() => setMenuVisible(c._id)}
                        />
                      }
                    >
                      <Menu.Item onPress={() => reply(id)} title="Répondre" />
                      <Menu.Item onPress={() => report(c._id)} title="Signaler" />
                    </Menu>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default CommentInlineCard;
