import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import {
  PanGestureHandler,
  NativeViewGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class BottomSheet extends React.Component {
  drawer = React.createRef();

  scroll = React.createRef();

  masterdrawer = React.createRef();

  drawerheader = React.createRef();

  constructor(props) {
    super(props);
    const { snapPointsFromTop } = this.props;
    const START = snapPointsFromTop[0];
    const END = snapPointsFromTop[snapPointsFromTop.length - 1];

    this.state = {
      lastSnap: END,
    };

    this.lastScrollYValue = 0;
    this.lastScrollY = new Animated.Value(0);
    this.onRegisterLastScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.lastScrollY } } }],
      { useNativeDriver: true },
    );
    this.lastScrollY.addListener(({ value }) => {
      this.lastScrollYValue = value;
    });

    this.dragY = new Animated.Value(0);
    this.onGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this.dragY } }],
      { useNativeDriver: true },
    );

    this.reverseLastScrollY = Animated.multiply(
      new Animated.Value(-1),
      this.lastScrollY,
    );

    this.translateYOffset = new Animated.Value(END);
    this.translateY = Animated.add(
      this.translateYOffset,
      Animated.add(this.dragY, this.reverseLastScrollY),
    ).interpolate({
      inputRange: [START, END],
      outputRange: [START, END],
      extrapolate: 'clamp',
    });
  }


  onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      let { velocityY, translationY } = nativeEvent;
      translationY -= this.lastScrollYValue;
      const dragToss = 0.05;
      const { lastSnap } = this.state;
      const { snapPointsFromTop } = this.props;
      const endOffsetY = lastSnap + translationY + dragToss * velocityY;

      let destSnapPoint = snapPointsFromTop[0];
      for (let i = 0; i < snapPointsFromTop.length; i += 1) {
        const snapPoint = snapPointsFromTop[i];
        const distFromSnap = Math.abs(snapPoint - endOffsetY);
        if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
          destSnapPoint = snapPoint;
        }
      }
      this.setState({ lastSnap: destSnapPoint });
      this.setState({ destSnap: destSnapPoint });
      this.translateYOffset.extractOffset();
      this.translateYOffset.setValue(translationY);
      this.translateYOffset.flattenOffset();
      this.dragY.setValue(0);
      Animated.spring(this.translateYOffset, {
        velocity: velocityY,
        tension: 68,
        friction: 11,
        toValue: destSnapPoint,
        useNativeDriver: true,
      }).start(this.onFinishAnimation);
    }
  };

  onFinishAnimation = ({ finished }) => {
    const { destSnap } = this.state;
    const { snapPointsFromTop } = this.props;
    if (finished && destSnap === snapPointsFromTop[0]) {
      console.log('Final point reached!');
    }
  }

  render() {
    const { children, timeout, snapPointsFromTop } = this.props;
    const { lastSnap } = this.state;
    return (
      <TapGestureHandler
        ref={this.masterdrawer}
        maxDurationMs={timeout}
        maxDeltaY={lastSnap - snapPointsFromTop[0]}
      >
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [{ translateY: this.translateY }],
              },
            ]}
          >
            <PanGestureHandler
              ref={this.drawer}
              simultaneousHandlers={[this.scroll, this.masterdrawer]}
              shouldCancelWhenOutside={false}
              onGestureEvent={this.onGestureEvent}
              onHandlerStateChange={this.onHandlerStateChange}
            >
              <Animated.View style={styles.container}>
                <NativeViewGestureHandler
                  ref={this.scroll}
                  waitFor={this.masterdrawer}
                  simultaneousHandlers={this.drawer}
                >
                  {children}
                </NativeViewGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </View>
      </TapGestureHandler>
    );
  }
}

export default withNavigation(BottomSheet);

BottomSheet.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  snapPointsFromTop: PropTypes.arrayOf(PropTypes.number).isRequired,
  timeout: PropTypes.number,
};

BottomSheet.defaultProps = {
  timeout: 100000,
};
