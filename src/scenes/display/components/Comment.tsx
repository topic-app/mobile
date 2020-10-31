import React from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { Text, IconButton, Menu } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';

import { Comment } from '@ts/types';
import { Avatar, Content } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';

import getCommentStyles from './styles/Styles';

type CommentInlineCardProps = {
  comment: Comment;
  report: (id: string) => any;
  loggedIn: boolean;
  navigation: StackNavigationProp<any, any>;
};

const CommentInlineCard: React.FC<CommentInlineCardProps> = ({
  comment,
  report,
  loggedIn,
  navigation,
}) => {
  const { publisher, content, date, _id: id } = comment;
  const { displayName } = publisher[publisher.type] || {};

  const theme = useTheme();
  const styles = getStyles(theme);
  const commentStyles = getCommentStyles(theme);

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

  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Avatar
          avatar={publisher.type === 'user' ? publisher.user?.info.avatar : publisher.group?.avatar}
          size={40}
          onPress={navigateToPublisher}
        />
        <View style={{ paddingLeft: 10, flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              activeOpacity={Platform.OS === 'ios' ? 0.2 : 0.6}
              onPress={navigateToPublisher}
            >
              <Text style={commentStyles.username}>{displayName}</Text>
            </TouchableOpacity>
            <Text style={commentStyles.username}> · {moment(date).fromNow()}</Text>
          </View>
          <Content data={content.data} parser={content.parser} />
          {/* add a "View Replies" button if replies exist */}
        </View>
        {loggedIn && (
          <View style={{ alignItems: 'flex-end' }}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
            >
              <Menu.Item onPress={() => {}} title="Répondre" />
              <Menu.Item onPress={() => report(id)} title="Signaler" />
            </Menu>
          </View>
        )}
      </View>
    </View>
  );
};

export default CommentInlineCard;
