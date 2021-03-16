import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Text, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import getStyles from '@styles/Styles';
import { Avatar as AvatarType } from '@ts/types';
import { useTheme } from '@utils';

import Avatar from './Avatar';
import { PlatformTouchable } from './PlatformComponents';

type InlineCardProps = {
  title: string;
  subtitle?: string | null;
  onPress?: () => void;
  badge?: string;
  badgeColor?: string;
  icon?: string;
  iconColor?: string;
  imageUrl?: string;
  avatar?: AvatarType;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
  subtitleNumberOfLines?: number;
  titleNumberOfLines?: number;
};

const InlineCard: React.FC<InlineCardProps> = ({
  title,
  subtitle,
  onPress,
  badge,
  badgeColor,
  icon,
  iconColor,
  imageUrl,
  avatar,
  style,
  compact,
  subtitleNumberOfLines,
  titleNumberOfLines,
}) => {
  const { colors } = useTheme();

  let IconElement: React.FC | null = null;
  if (compact && icon) {
    IconElement = () => <Icon name={icon} size={25} color={iconColor ?? colors.icon} />;
  } else if (icon || imageUrl || avatar) {
    IconElement = () => <Avatar size={50} imageUrl={imageUrl} icon={icon} avatar={avatar} />;
  }

  const cardContents = (
    <View
      style={[
        {
          paddingHorizontal: 12,
          paddingVertical: compact ? 12 : 10,
          flexDirection: 'row',
          minHeight: compact ? 20 : 40,
        },
        style,
      ]}
    >
      {IconElement ? <IconElement /> : null}
      <View style={{ paddingLeft: IconElement ? 15 : 0, alignSelf: 'center', flex: 1 }}>
        <Text style={{ fontSize: 16 }} numberOfLines={titleNumberOfLines}>
          {title}
          {'  '}
          {badge && <Icon color={badgeColor ?? colors.icon} name={badge} size={16} />}
        </Text>
        {subtitle ? (
          <Text style={{ color: colors.subtext }} numberOfLines={subtitleNumberOfLines}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );

  return onPress ? (
    <PlatformTouchable onPress={onPress}>{cardContents}</PlatformTouchable>
  ) : (
    cardContents
  );
};

type CardBaseProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const CardBase: React.FC<CardBaseProps> = ({ onPress, style, contentContainerStyle, children }) => {
  const styles = getStyles(useTheme());

  return onPress ? (
    <Card style={[styles.card, style]}>
      <PlatformTouchable onPress={onPress}>
        <View style={[{ paddingTop: 10, paddingBottom: 10 }, contentContainerStyle]}>
          {children}
        </View>
      </PlatformTouchable>
    </Card>
  ) : (
    <Card style={[styles.card, style]}>
      <View style={[{ paddingTop: 10, paddingBottom: 5 }, contentContainerStyle]}>{children}</View>
    </Card>
  );
};

export { InlineCard, CardBase };
