import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, Paragraph, Title, Card } from 'react-native-paper';

import getStyles from '@styles/Styles';
import { User, UserPreload } from '@ts/types';
import { useTheme } from '@utils/index';

import { InlineCard } from '../Cards';

type GroupCardProps = {
  user: User | UserPreload;
  navigate: StackNavigationProp<any, any>['navigate'];
  following?: boolean;
};

const UserCard: React.FC<GroupCardProps> = ({ user, navigate, following = false }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <Card style={styles.card}>
      <InlineCard
        key={user._id}
        avatar={user.info?.avatar}
        title={user.displayName}
        subtitle={user.displayName === user.info?.username ? undefined : `@${user.info?.username}`}
        onPress={navigate}
        badge={following ? 'heart' : undefined}
        badgeColor={colors.primary}
      />
    </Card>
  );
};

export default UserCard;
