import React from 'react';
import {
  Platform,
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacity as ReactNativeTouchableOpacity,
  TouchableOpacityProps,
  TouchableNativeFeedbackProps,
} from 'react-native';
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '@utils';

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
        <Icon name={iosIcon || icon} color={color ?? colors.icon} size={iosSize || size * 1.4} />
      </View>
    );
    return onPress ? (
      <TouchableOpacity onPress={onPress}>{iconComponent}</TouchableOpacity>
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

type PlatformTouchableType = React.ComponentClass<
  TouchableOpacityProps | TouchableNativeFeedbackProps
>;

const PlatformTouchable = Platform.select<PlatformTouchableType>({
  ios: TouchableOpacity as React.ComponentClass<TouchableOpacityProps>,
  android: TouchableNativeFeedback,
  default: ReactNativeTouchableOpacity,
});

type PlatformBackButtonProps = {
  onPress: () => void;
};

const PlatformBackButton: React.FC<PlatformBackButtonProps> = ({ onPress }) =>
  Platform.OS === 'web' ? (
    <View />
  ) : (
    <PlatformIconButton
      icon="arrow-left"
      androidIcon="arrow-left"
      iosIcon="chevron-left"
      onPress={onPress}
    />
  );

export { PlatformBackButton, PlatformIconButton, PlatformTouchable };
