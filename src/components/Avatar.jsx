import React from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes } from 'react-native';
import { Avatar as PaperAvatar, useTheme } from 'react-native-paper';
import TopicIcon from '@assets/images/topic-icon.svg';

const getInitials = (title) => {
  const initials = title.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
};

function Avatar({ name, imageUrl, icon, style, size }) {
  const { colors } = useTheme();

  if (imageUrl) {
    return <PaperAvatar.Image size={size} source={{ uri: imageUrl }} style={style} />;
  }
  if (icon) {
    return (
      <PaperAvatar.Icon
        size={size}
        icon={icon}
        style={[{ backgroundColor: colors.disabled }, style]}
      />
    );
  }
  if (name) {
    return <PaperAvatar.Text label={getInitials(name)} style={style} size={size} />;
  }
  // If we cannot use anything, use Topic's Icon as the default
  return <TopicIcon height={size} width={size} style={style} />;
}

export default Avatar;

Avatar.defaultProps = {
  imageUrl: null,
  style: null,
  size: 64,
  name: null,
  icon: null,
};

Avatar.propTypes = {
  name: PropTypes.string,
  imageUrl: PropTypes.string,
  icon: PropTypes.string,
  style: ViewPropTypes.style,
  size: PropTypes.number,
};
