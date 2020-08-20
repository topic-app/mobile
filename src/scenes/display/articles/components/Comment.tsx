import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, TouchableOpacity } from 'react-native';
import { Text, useTheme, IconButton, Menu, Provider, Divider } from 'react-native-paper';
import Avatar from '@components/Avatar';
import Content from '@components/Content';
import { PlatformIconButton } from '@components/PlatformComponents';
import getStyles from '@styles/Styles';
import moment from 'moment';
import getCommentStyles from '../styles/Styles';

function CommentInlineCard({ comment, report, loggedIn, navigation }) {
  const { publisher, content, date, parent, parentType, _id: id } = comment;
  const { _id: publisherId, displayName } = publisher[publisher.type] || {};

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
}

export default CommentInlineCard;

CommentInlineCard.propTypes = {
  comment: PropTypes.shape({
    publisher: PropTypes.shape({
      type: PropTypes.oneOf(['user', 'group']).isRequired,
      user: PropTypes.shape({
        info: PropTypes.shape({
          username: PropTypes.string,
        }),
        _id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
      }),
      group: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
      }),
    }).isRequired,
    content: PropTypes.shape({
      parser: PropTypes.oneOf(['plaintext', 'markdown']).isRequired,
      data: PropTypes.string.isRequired,
    }).isRequired,
    date: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired,
    parentType: PropTypes.string.isRequired,
  }).isRequired,
};
