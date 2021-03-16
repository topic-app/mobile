import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { Avatar, Content } from '@components';
import { EventMessage } from '@ts/types';
import { Format } from '@utils';

import getStyles from '../styles';

type MessageInlineCardProps = {
  isPublisher: boolean;
  message: EventMessage;
};

const MessageInlineCard: React.FC<MessageInlineCardProps> = ({ message, isPublisher }) => {
  const { group, type, content, date } = message;

  const theme = useTheme();
  const styles = getStyles(theme);

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
            <Text style={styles.username}>
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
