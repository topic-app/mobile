import moment from 'moment';
import React from 'react';
import { View, Platform, TouchableOpacity } from 'react-native';
import { Text, IconButton, Menu } from 'react-native-paper';

import { Avatar, Content } from '@components/index';
import getStyles from '@styles/Styles';
import { EventMessage } from '@ts/types';
import { Format, useTheme } from '@utils/index';

import getMessageStyles from '../styles/Styles';

type MessageInlineCardProps = {
  isPublisher: boolean;
  message: EventMessage;
};

const MessageInlineCard: React.FC<MessageInlineCardProps> = ({ message, isPublisher }) => {
  const { group, type, content, date } = message;

  const theme = useTheme();
  const styles = getStyles(theme);
  const messageStyles = getMessageStyles(theme);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        {!isPublisher && type !== 'system' ? (
          <Avatar avatar={group?.avatar} size={40} />
        ) : (
          <View style={{ width: 40 }} />
        )}
        <View style={{ paddingLeft: 10, flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={messageStyles.username}>
              {type === 'system' ? 'Message système' : `Groupe ${Format.groupName(group)}`}
              {isPublisher ? ' ✓' : ''} · {moment(date).fromNow()}
            </Text>
          </View>
          <Content data={content.data} parser={content.parser} />
        </View>
      </View>
    </View>
  );
};

export default MessageInlineCard;
