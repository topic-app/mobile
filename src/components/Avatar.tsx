import React from 'react';
import { View, ViewStyle, TextStyle, ImageStyle, StyleProp } from 'react-native';
import { Avatar as PaperAvatar, Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import color from 'color';

import { Avatar as AvatarType } from '@ts/types';
import { Illustration } from '@components/index';
import { useTheme } from '@utils/index';

import Image from './CustomImage';
import { PlatformTouchable } from './PlatformComponents';

const getInitials = (title: string) => {
  const initials = title.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
};

type AvatarProps = {
  name?: string;
  imageUrl?: string;
  icon?: string;
  style?: StyleProp<ViewStyle | ImageStyle | TextStyle>;
  size?: number;
  onPress?: () => void;
  avatar?: AvatarType;
  large?: boolean;
};

const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  icon,
  style,
  size = 64,
  onPress,
  avatar,
  large = false,
}) => {
  const theme = useTheme();
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
          angle={avatar.gradient.angle || 0}
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
    } else if (avatar.type === 'image') {
      AvatarComponent = (
        <Image
          height={size}
          width={size}
          style={{ borderRadius: size / 2 }}
          image={avatar.image}
          imageSize={large ? 'large' : 'small'}
        />
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
  } else if (name) {
    AvatarComponent = <PaperAvatar.Text label={getInitials(name)} style={style} size={size} />;
  } else if (icon) {
    // If we cannot use anything, use Topic's Icon as the default; subject to change
    AvatarComponent = (
      <PaperAvatar.Icon
        color={theme.dark ? colors.text : undefined}
        size={size}
        icon={icon ?? 'person-outline'}
        style={[{ backgroundColor: colors.disabled }, style]}
      />
    );
  } else {
    AvatarComponent = <Illustration name="topic-icon" height={size} width={size} style={style} />;
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
