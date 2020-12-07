import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { Text, Paragraph, Title, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import getStyles from '@styles/Styles';
import { AnyGroup } from '@ts/types';
import { useTheme } from '@utils/index';

import Avatar from '../Avatar';
import { PlatformTouchable } from '../PlatformComponents';

type GroupCardProps = {
  group: AnyGroup;
  navigate: StackNavigationProp<any, any>['navigate'];
  member?: boolean;
  following?: boolean;
};

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  navigate,
  member = false,
  following = false,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <Card style={styles.card}>
      <PlatformTouchable onPress={navigate}>
        <View>
          <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
              <Avatar avatar={group.avatar} style={styles.avatar} />
              <View style={{ flex: 1, paddingLeft: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Title numberOfLines={1}>{group?.name}</Title>
                  <View style={{ marginLeft: 5 }}>
                    {group?.official && (
                      <Icon name="check-decagram" color={colors.primary} size={20} />
                    )}
                  </View>
                </View>
                <Paragraph style={{ fontSize: 15 }}>
                  <Text style={{ fontSize: 16 }}>{group.cache?.members}</Text> membres &#xFF65;{' '}
                  <Text style={{ fontSize: 16 }}>{group.cache?.followers}</Text> abonnés
                </Paragraph>
              </View>
              <View>
                {following && <Icon name="star-circle" color={colors.primary} size={32} />}
                {member && <Icon name="account-outline" color={colors.primary} size={32} />}
              </View>
            </View>
            <Paragraph numberOfLines={3} style={{ paddingTop: 7, paddingHorizontal: 5 }}>
              {group.summary}
            </Paragraph>
          </View>
        </View>
      </PlatformTouchable>
    </Card>
  );
};

export default GroupCard;
