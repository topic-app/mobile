import React from 'react';
import { View, ViewStyle, TextStyle, ImageStyle, StyleProp } from 'react-native';
import { Avatar as PaperAvatar, Text, useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import color from 'color';

import { Avatar as AvatarType, Theme } from '@ts/types';
import TopicIcon from '@assets/images/topic-icon.svg';

import { PlatformTouchable } from './PlatformComponents';

const getInitials = (title: string) => {
  const initials = title.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
};

type Props = {
  name?: string;
  imageUrl?: string;
  icon?: string;
  style?: StyleProp<ViewStyle | ImageStyle | TextStyle>;
  size?: number;
  onPress?: () => void;
  avatar?: AvatarType;
};

const Avatar: React.FC<Props> = ({ name, imageUrl, icon, style, size = 64, onPress, avatar }) => {
  const theme: Theme = useTheme();
  const { colors } = theme;

  let AvatarComponent = null;

  if (avatar) {
    if (avatar.type === 'gradient') {
      AvatarComponent = (
        <LinearGradient
          colors={[avatar.gradient.start, avatar.gradient.end]}
          style={{
            height: size,
            width: size,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          useAngle
          angle={avatar.gradient.angle}
          angleCenter={{ x: 0.5, y: 0.5 }}
        >
          <Text
            style={{
              fontSize: size - 20,
              color:
                color(avatar.gradient.start).isLight() && color(avatar.gradient.end).isLight()
                  ? '#000'
                  : '#FFF',
            }}
          >
            {avatar.text?.toUpperCase()}
          </Text>
        </LinearGradient>
      );
    } else {
      AvatarComponent = (
        <PaperAvatar.Text
          label={avatar.text}
          color={color(avatar.color).isLight() ? '#000' : '#FFF'}
          size={size}
          style={[{ backgroundColor: avatar.color || colors.primary }, style]}
        />
      );
    }
  } else if (imageUrl) {
    AvatarComponent = <PaperAvatar.Image size={size} source={{ uri: imageUrl }} style={style} />;
  } else if (icon) {
    AvatarComponent = (
      <PaperAvatar.Icon
        color={theme.dark ? colors.text : undefined}
        size={size}
        icon={icon}
        style={[{ backgroundColor: colors.disabled }, style]}
      />
    );
  } else if (name) {
    AvatarComponent = <PaperAvatar.Text label={getInitials(name)} style={style} size={size} />;
  } else {
    // If we cannot use anything, use Topic's Icon as the default; subject to change
    AvatarComponent = <TopicIcon height={size} width={size} style={style} />;
  }
  if (onPress) {
    return (
      <View style={{ borderRadius: size / 2, overflow: 'hidden' }}>
        <PlatformTouchable onPress={onPress}>{AvatarComponent}</PlatformTouchable>
      </View>
    );
  }
  return AvatarComponent;
};

export default Avatar;
