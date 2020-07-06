import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import getStyles from '@styles/Styles';

import Avatar from './Avatar';
import { PlatformTouchable } from './PlatformComponents';

type InlineCardProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  badge?: string;
  badgeColor?: string;
  icon?: string;
  imageUrl?: string;
};

const InlineCard: React.FC<InlineCardProps> = ({
  title,
  subtitle,
  onPress,
  badge,
  badgeColor,
  icon,
  imageUrl,
}) => {
  const { colors } = useTheme();

  const cardContents = (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        minHeight: 40,
      }}
    >
      {icon || imageUrl ? <Avatar size={50} imageUrl={imageUrl} icon={icon} /> : null}
      <View style={{ paddingLeft: 15, alignSelf: 'center' }}>
        <Text style={{ fontSize: 16 }}>
          {title}
          {'  '}
          {badge && <Icon color={badgeColor || colors.icon} name={badge} size={16} />}
        </Text>
        {subtitle && <Text style={{ color: colors.subtext }}>{subtitle}</Text>}
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
        <View style={[{ paddingTop: 10, paddingBottom: 5 }, contentContainerStyle]}>
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
