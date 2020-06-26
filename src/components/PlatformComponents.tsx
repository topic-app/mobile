import React from 'react';
import { TouchableHighlight, Platform, ViewPropTypes } from 'react-native';
import { IconButton, useTheme, TouchableRipple } from 'react-native-paper';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function PlatformIconButton({
  icon,
  iosIcon,
  androidIcon,
  size,
  iosSize,
  androidSize,
  onPress,
  style,
  color,
}) {
  const theme = useTheme();
  const { colors } = theme;
  if (Platform.OS === 'ios') {
    const iconComponent = (
      <Icon
        name={iosIcon || icon}
        color={color ?? colors.icon}
        style={style}
        size={iosSize || size * 1.2}
      />
    );
    return onPress ? (
      <TouchableHighlight onPress={onPress}>{iconComponent}</TouchableHighlight>
    ) : (
      iconComponent
    );
  }
  return (
    <IconButton
      icon={androidIcon || icon}
      color={color ?? colors.icon}
      size={androidSize || size}
      onPress={onPress}
      style={style}
    />
  );
}

const PlatformTouchable = Platform.OS === 'ios' ? TouchableHighlight : TouchableRipple;
const PlatformBackButton = ({ onPress }) => (
  <PlatformIconButton androidIcon="arrow-left" iosIcon="chevron-left" onPress={onPress} />
);

PlatformBackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

PlatformIconButton.defaultProps = {
  icon: null,
  color: null,
  iosIcon: null,
  androidIcon: null,
  size: 25,
  iosSize: null,
  androidSize: null,
  style: null,
  onPress: null,
};

PlatformIconButton.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
  iosIcon: PropTypes.string,
  iosSize: PropTypes.number,
  androidIcon: PropTypes.string,
  androidSize: PropTypes.number,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
};

export { PlatformBackButton, PlatformIconButton, PlatformTouchable };
