import color from 'color';
import React from 'react';
import { View, ViewStyle, TextStyle, ImageStyle, StyleProp, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Avatar as PaperAvatar, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Avatar as AvatarType } from '@ts/types';

import Image from './CustomImage';

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
  editing?: boolean;
  imageSize?: 'small' | 'medium' | 'large' | 'extralarge' | 'full';
};

const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  icon,
  style,
  size = 64,
  onPress,
  avatar,
  imageSize = 'small',
  large = false,
  editing = false,
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
          imageSize={imageSize}
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
    AvatarComponent = <PaperAvatar.Icon size={size} icon="account" style={style} />;
  }
  if (editing) {
    AvatarComponent = (
      <View>
        {AvatarComponent}
        <View
          style={{
            borderRadius: 20,
            backgroundColor: 'black',
            width: 40,
            height: 40,
            opacity: 0.7,
            marginTop: -50,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="pencil" color="white" size={24} />
        </View>
      </View>
    );
  }
  if (onPress) {
    return (
      <View style={{ borderRadius: size / 2 }}>
        <TouchableOpacity
          onPress={onPress}
          style={{ height: size, width: size }}
          accessibilityLabel="Avatar"
        >
          {AvatarComponent}
        </TouchableOpacity>
      </View>
    );
  }
  return AvatarComponent;
};

export default Avatar;
