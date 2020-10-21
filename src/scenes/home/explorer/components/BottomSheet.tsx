import React from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';
import {
  PanGestureHandler,
  NativeViewGestureHandler,
  State,
  TapGestureHandler,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

let { height, width } = Dimensions.get('window');
let lastOrientation = height > width ? ('portrait' as const) : ('landscape' as const);

let SNAP_POINTS_FROM_TOP = {
  portrait: [0, height * 0.5, height * 0.71, height],
  landscape: [0, width * 0.65, width],
};
if (lastOrientation === 'landscape') {
  SNAP_POINTS_FROM_TOP = {
    portrait: [0, width * 0.5, width * 0.71, width],
    landscape: [0, height * 0.65, height],
  };
}

type BottomSheetProps = {
  timeout?: number;
  hideModal: () => void;
};

const BottomSheet: React.FC<BottomSheetProps> = ({ timeout = 100000, hideModal, children }) => {
  const isMounted = React.useRef(false);
  const drawer = React.createRef<PanGestureHandler>();
  const scroll = React.createRef<NativeViewGestureHandler>();
  const masterDrawer = React.createRef<TapGestureHandler>();

  const initSP = SNAP_POINTS_FROM_TOP[lastOrientation];
  const [snapPointsFromTop, setSnapPointsFromTop] = React.useState(initSP);
  const [lastSnap, setLastSnap] = React.useState(initSP[initSP.length - 2]);

  // Init animation variables
  let lastScrollYValue = 0;
  let dragY = new Animated.Value(0);
  let translateYOffset = new Animated.Value(0);
  let translateY: Animated.AnimatedInterpolation = new Animated.Value(0);
  let onGestureEvent = () => {};

  // Set animation variables to correct values
  const initializeSheet = (startSnap: number, SP: number[]) => {
    const START = SP[0];
    const END = SP[SP.length - 1];
    const lastScrollY = new Animated.Value(0);
    // const onRegisterLastScroll = Animated.event(
    //   [{ nativeEvent: { contentOffset: { y: lastScrollY } } }],
    //   { useNativeDriver: true },
    // );
    lastScrollY.addListener(({ value }) => {
      lastScrollYValue = value;
    });

    dragY = new Animated.Value(0);
    onGestureEvent = Animated.event([{ nativeEvent: { translationY: dragY } }], {
      useNativeDriver: true,
    });

    const reverseLastScrollY = Animated.multiply(new Animated.Value(-1), lastScrollY);

    translateYOffset = new Animated.Value(startSnap);
    translateY = Animated.add(
      translateYOffset,
      Animated.add(dragY, reverseLastScrollY),
    ).interpolate({
      inputRange: [START, END],
      outputRange: [START, END],
      extrapolate: 'clamp',
    });
  };

  const onHandlerStateChange = ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      const { velocityY } = nativeEvent;
      let { translationY } = nativeEvent;
      translationY -= lastScrollYValue;
      const dragToss = 0.05;
      const endOffsetY = lastSnap + translationY + dragToss * velocityY;

      let destSnapPoint = snapPointsFromTop[0];
      for (let i = 0; i < snapPointsFromTop.length; i += 1) {
        const snapPoint = snapPointsFromTop[i];
        const distFromSnap = Math.abs(snapPoint - endOffsetY);
        if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
          destSnapPoint = snapPoint;
        }
      }
      setLastSnap(destSnapPoint);
      checkVisible(destSnapPoint);
      translateYOffset.extractOffset();
      translateYOffset.setValue(translationY);
      translateYOffset.flattenOffset();
      dragY.setValue(0);
      Animated.spring(translateYOffset, {
        velocity: velocityY,
        tension: 50,
        friction: 8,
        toValue: destSnapPoint,
        useNativeDriver: true,
      }).start();
    }
  };

  const checkVisible = (snap: number) => {
    if (snap === snapPointsFromTop[snapPointsFromTop.length - 1]) {
      setLastSnap(snapPointsFromTop[snapPointsFromTop.length - 2]);
      setTimeout(() => {
        if (isMounted.current) hideModal();
      }, 150);
    }
  };

  const getDeviceOrientation = () => {
    height = Dimensions.get('window').height;
    width = Dimensions.get('window').width;
    return height > width ? 'portrait' : 'landscape';
  };

  const onLayout = () => {
    // Detect if device has changed rotation
    const orientation = getDeviceOrientation();
    if (orientation !== lastOrientation) {
      const newSP = SNAP_POINTS_FROM_TOP[orientation];
      let LS = newSP[newSP.length - 2];
      if (lastSnap === snapPointsFromTop[0]) {
        // If pull-up menu is in fullscreen, then keep fullscreen after rotation
        [LS] = newSP; // equivalent to LS = SP[0]
      }
      lastOrientation = orientation;
      setSnapPointsFromTop(newSP);
      setLastSnap(LS);
      initializeSheet(LS, newSP);
    }
  };

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  initializeSheet(lastSnap, snapPointsFromTop);

  return (
    <TapGestureHandler
      ref={masterDrawer}
      maxDurationMs={timeout}
      maxDeltaY={lastSnap - snapPointsFromTop[0]}
    >
      <View style={StyleSheet.absoluteFillObject} onLayout={onLayout} pointerEvents="box-none">
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <PanGestureHandler
            ref={drawer}
            simultaneousHandlers={[scroll, masterDrawer]}
            shouldCancelWhenOutside={false}
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View style={{ flex: 1 }}>
              <NativeViewGestureHandler
                ref={scroll}
                waitFor={masterDrawer}
                simultaneousHandlers={drawer}
              >
                {children}
              </NativeViewGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </View>
    </TapGestureHandler>
  );
};

export default BottomSheet;
