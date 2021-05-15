import React from 'react';
import { Platform, Animated, View, ViewStyle, StyleProp } from 'react-native';

import { HeaderBar, HeaderBarProps } from './Header';

type AnimatingHeaderProps = HeaderBarProps & {
  value: Animated.Value;
  maxElevation?: number;
  children?: React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  title: string;
};

const AnimatingHeader: React.FC<AnimatingHeaderProps> = ({
  value,
  maxElevation = 7,
  children,
  headerStyle,
  ...rest
}) => {
  const headerElevation = value.interpolate({
    inputRange: [0, maxElevation],
    outputRange: [0, maxElevation],
    extrapolate: 'clamp',
  });

  return Platform.OS !== 'ios' ? (
    <Animated.View style={{ backgroundColor: 'white', elevation: headerElevation, zIndex: 10 }}>
      <HeaderBar headerStyle={[headerStyle, { elevation: 0 }]} {...rest} />
      {children}
    </Animated.View>
  ) : (
    <View>
      <HeaderBar headerStyle={headerStyle} {...rest} />
      {children}
    </View>
  );
};

export default AnimatingHeader;
