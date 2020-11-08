import React from 'react';
import { Platform, View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { IconButton, useTheme, TouchableRipple } from 'react-native-paper';
import { TouchableHighlight, TouchableNativeFeedback } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type PlatformIconButtonProps = {
  // TODO: find a way to accept either `icon`, or `iosIcon` and `androidIcon`
  icon: string;
  iosIcon?: string;
  androidIcon?: string;
  size?: number;
  iosSize?: number;
  androidSize?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  color?: string;
};

const PlatformIconButton: React.FC<PlatformIconButtonProps> = ({
  icon,
  iosIcon,
  androidIcon,
  size = 25,
  iosSize,
  androidSize,
  onPress,
  style,
  color,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  if (Platform.OS === 'ios') {
    const iconComponent = (
      <View style={style}>
        <Icon name={iosIcon || icon} color={color ?? colors.icon} size={iosSize || size * 1.2} />
      </View>
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
};

type PlatformBackButtonProps = {
  onPress: () => void;
};

const PlatformTouchable =
  Platform.OS === 'ios'
    ? TouchableOpacity
    : Platform.OS === 'android'
    ? TouchableNativeFeedback
    : TouchableOpacity;

const PlatformBackButton: React.FC<PlatformBackButtonProps> = ({ onPress }) => (
  <PlatformIconButton
    icon="arrow-left"
    androidIcon="arrow-left"
    iosIcon="chevron-left"
    onPress={onPress}
  />
);

PlatformBackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export { PlatformBackButton, PlatformIconButton, PlatformTouchable };
