import React from 'react';
import { Platform, Animated, View, ViewStyle, StyleProp } from 'react-native';

import { CustomHeaderBar, CustomHeaderBarProps } from './Header';

type Props = CustomHeaderBarProps['scene']['descriptor']['options'] & {
  value: Animated.Value;
  maxElevation?: number;
  children?: React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  title: string;
};

const AnimatingHeader: React.FC<Props> = ({
  value,
  maxElevation = 10,
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
    <Animated.View style={{ backgroundColor: 'white', elevation: headerElevation }}>
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              headerStyle: { ...headerStyle, elevation: 0 }, // elevation takes precedence
              ...rest,
            },
          },
        }}
      />
      {children}
    </Animated.View>
  ) : (
    <View>
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              headerStyle,
              ...rest,
            },
          },
        }}
      />
      {children}
    </View>
  );
};

export default AnimatingHeader;
