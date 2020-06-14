import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';
import { Avatar as PaperAvatar, useTheme } from 'react-native-paper';
import TopicIcon from '@assets/images/topic-icon.svg';
import { PlatformTouchable } from './PlatformComponents';

const getInitials = (title) => {
  const initials = title.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
};

function Avatar({ name, imageUrl, icon, style, size, onPress }) {
  const theme = useTheme();
  const { colors } = theme;

  let AvatarComponent = null;

  if (imageUrl) {
    AvatarComponent = <PaperAvatar.Image size={size} source={{ uri: imageUrl }} style={style} />;
  } else if (icon) {
    AvatarComponent = (
      <PaperAvatar.Icon
        onPress={onPress}
        color={theme.dark ? colors.text : null}
        size={size}
        icon={icon}
        style={[{ backgroundColor: colors.disabled }, style]}
      />
    );
  } else if (name) {
    AvatarComponent = (
      <PaperAvatar.Text onPress={onPress} label={getInitials(name)} style={style} size={size} />
    );
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
}

export default Avatar;

Avatar.defaultProps = {
  imageUrl: null,
  style: null,
  size: 64,
  name: null,
  icon: null,
  onPress: null,
};

Avatar.propTypes = {
  name: PropTypes.string,
  imageUrl: PropTypes.string,
  icon: PropTypes.string,
  style: ViewPropTypes.style,
  size: PropTypes.number,
  onPress: PropTypes.func,
};
