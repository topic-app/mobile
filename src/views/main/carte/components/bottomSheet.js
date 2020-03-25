import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import {
  PanGestureHandler,
  NativeViewGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

const { height, width } = Dimensions.get('window');
let lastOrientation = (height > width) ? 'portrait' : 'landscape';

let SNAP_POINTS_FROM_TOP = {
  portrait: [0, height * 0.5, height * 0.73, height],
  landscape: [0, width * 0.4, width],
};
if (lastOrientation === 'landscape') {
  SNAP_POINTS_FROM_TOP = {
    portrait: [0, width * 0.5, width * 0.73, width],
    landscape: [0, height * 0.4, height],
  };
}

class BottomSheet extends React.Component {
  drawer = React.createRef();

  scroll = React.createRef();

  masterdrawer = React.createRef();

  drawerheader = React.createRef();

  constructor(props) {
    super(props);
    const SP = SNAP_POINTS_FROM_TOP[lastOrientation];
    const lastSnap = SP[SP.length - 2];
    this.state = {
      snapPointsFromTop: SP,
      lastSnap,
    };
    this.initializeSheet(lastSnap, SP);
  }

  initializeSheet = (startSnap, SP) => {
    const START = SP[0];
    const END = SP[SP.length - 1];
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

    this.translateYOffset = new Animated.Value(startSnap);
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
      const { lastSnap, snapPointsFromTop } = this.state;
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
      this.checkVisible(destSnapPoint);
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
      }).start();
    }
  }

  checkVisible = (snap) => {
    const { snapPointsFromTop } = this.state;
    if (snap === snapPointsFromTop[snapPointsFromTop.length - 1]) {
      const { hideModal } = this.props;
      this.setState({ lastSnap: snapPointsFromTop[snapPointsFromTop.length - 2] });
      setTimeout(hideModal, 150);
    }
  }

  getDeviceOrientation = () => {
    const { height, width } = Dimensions.get('window');
    return (height > width) ? 'portrait' : 'landscape';
  }

  onLayout = (e) => {
    // Detect if device has changed rotation
    const orientation = this.getDeviceOrientation();
    if (orientation !== lastOrientation) {
      const { lastSnap, snapPointsFromTop } = this.state;
      const SP = SNAP_POINTS_FROM_TOP[orientation];
      let LS = SP[SP.length - 2];
      if (lastSnap === snapPointsFromTop[0]) {
        // If pull-up menu is in fullscreen, then keep fullscreen after rotation
        [LS] = SP; // equivalent to LS = SP[0]
      }
      lastOrientation = orientation;
      this.setState({
        snapPointsFromTop: SP,
        lastSnap: LS,
      });
      this.initializeSheet(LS, SP);
    }
  }

  render() {
    const { children, timeout } = this.props;
    const { lastSnap, snapPointsFromTop } = this.state;
    return (
      <TapGestureHandler
        ref={this.masterdrawer}
        maxDurationMs={timeout}
        maxDeltaY={lastSnap - snapPointsFromTop[0]}
      >
        <View style={StyleSheet.absoluteFillObject} onLayout={this.onLayout} pointerEvents="box-none">
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
              <Animated.View style={{ flex: 1 }}>
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

export default BottomSheet;

BottomSheet.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  hideModal: PropTypes.func.isRequired,
  timeout: PropTypes.number,
};

BottomSheet.defaultProps = {
  timeout: 100000,
};
