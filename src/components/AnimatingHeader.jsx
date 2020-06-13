import React from 'react';
import PropTypes from 'prop-types';
import { Platform, Animated, View, ViewPropTypes } from 'react-native';
import { CustomHeaderBar } from '@components/Header';
import { useNavigation } from '@react-navigation/native';

function AnimatingHeader({
  value,
  maxElevation,
  children,
  title,
  subtitle,
  home,
  primary,
  headerStyle,
  actions,
  overflow,
}) {
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
              title,
              subtitle,
              home,
              primary,
              headerStyle: { ...headerStyle, elevation: 0 }, // elevation takes precedence
              actions,
              overflow,
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
              title,
              subtitle,
              home,
              primary,
              headerStyle,
              actions,
              overflow,
            },
          },
        }}
        navigation={navigation}
      />
      {children}
    </View>
  );
}

export default AnimatingHeader;

AnimatingHeader.defaultProps = {
  maxElevation: 10,
  subtitle: null,
  headerStyle: null,
  primary: null,
  home: false,
  overflow: [],
  actions: [],
  children: null,
};

AnimatingHeader.propTypes = {
  value: PropTypes.instanceOf(Animated.Value).isRequired,
  maxElevation: PropTypes.number,
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  headerStyle: ViewPropTypes.style,
  primary: PropTypes.func,
  home: PropTypes.bool,
  overflow: PropTypes.arrayOf(PropTypes.object),
  actions: PropTypes.arrayOf(PropTypes.object),
};
