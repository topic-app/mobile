import React from 'react';
import { View } from 'react-native';
import { Text, Paragraph, Title, Card } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { GroupPreload } from '@ts/types';
import { Avatar, PlatformTouchable } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';

type MyGroupsListCardProps = {
  group: GroupPreload;
  navigate: StackNavigationProp<any, any>;
  member: boolean;
  following: boolean;
};

const MyGroupsListCard: React.FC<MyGroupsListCardProps> = ({
  group,
  navigate,
  member,
  following,
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
                <View>
                  <Title style={{ flex: 1 }} numberOfLines={1}>
                    {group.name}
                  </Title>
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

export default MyGroupsListCard;
