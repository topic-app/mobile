import React from 'react';
import { Platform, Animated, View, ViewStyle } from 'react-native';
import { CustomHeaderBar } from '@components/index';
import { useNavigation } from '@react-navigation/native';

type Props = {
  value: Animated.Value;
  maxElevation?: number;
  children?: React.ReactNode;
  headerStyle?: ViewStyle;
};

const AnimatingHeader: React.FC<Props> = ({
  value,
  maxElevation = 10,
  children,
  headerStyle,
  ...rest
}) => {
  const navigation = useNavigation();

  const headerElevation = value.interpolate({
    inputRange: [0, maxElevation],
    outputRange: [0, maxElevation],
    extrapolate: 'clamp',
  });

  return Platform.OS !== 'ios' ? (
    <Animated.View style={{ backgroundColor: 'white', elevation: headerElevation }}>
      <CustomHeaderBar
        navigation={navigation}
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
        navigation={navigation}
      />
      {children}
    </View>
  );
};

export default AnimatingHeader;
