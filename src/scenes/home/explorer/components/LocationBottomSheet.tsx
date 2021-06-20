import { useFocusEffect } from '@react-navigation/core';
import React from 'react';
import {
  View,
  BackHandler,
  useWindowDimensions,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import Animated, { call, cond, greaterThan, lessThan, useCode } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import shortid from 'shortid';

import {
  BottomSheet,
  BottomSheetRef,
  ContentTabView,
  InlineCard,
  PlatformBackButton,
} from '@components';
import { updateMapLocations } from '@redux/actions/api/places';
import { MapLocation, PlaceRequestState, State } from '@ts/types';
import { logger } from '@utils';

import type { MapMarkerDataType } from '../Map';
import getExplorerStyles from '../styles';
import { getStrings } from '../utils/getStrings';

const bottomSheetPortraitSnapPoints = [0, '40%', '100%'];
const bottomSheetLandscapeSnapPoints = [0, '60%', '100%'];

type LocationBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetRef>;
  mapMarkerData: MapMarkerDataType;
  zoomToLocation: (coordinates: [number, number]) => void;
  places: MapLocation.FullLocation[];
  reqState: PlaceRequestState;
  onCloseEnd?: () => void;
};

const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  bottomSheetRef,
  mapMarkerData,
  zoomToLocation,
  places,
  reqState,
  onCloseEnd,
}) => {
  const theme = useTheme();
  const explorerStyles = getExplorerStyles(theme);
  const { colors } = theme;

  const insets = useSafeAreaInsets();
  // 54 is the height of the bottom Tabbar
  const offset = Platform.select({
    android: 54,
    ios: 138, // To take into account the bottom bar
    default: 0,
  });
  const minHeight = useWindowDimensions().height + insets.top - offset;

  // Search for desired place in places
  const place = places.find((loc) => loc.id === mapMarkerData.id);

  React.useEffect(() => {
    const { id, type } = mapMarkerData;
    // Check that id is not a non-empty string
    // and that we don't already have the place locally
    if (id !== '' && !place) {
      updateMapLocations(type, id);
    }
  }, [mapMarkerData.id]);

  // Value that goes from 0 to 1 (where 1 is the bottom sheet hidden)
  const bottomSheetY = new Animated.Value(1);

  const animatedBackgroundOpacity = bottomSheetY.interpolate({
    inputRange: [0, 0.25],
    outputRange: [1, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const animatedSubtitleOpacity = bottomSheetY.interpolate({
    inputRange: [0.02, 0.1],
    outputRange: [0, 1],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const animatedHeaderOpacity = bottomSheetY.interpolate({
    inputRange: [0.005, 0.02],
    outputRange: [1, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const animatedHeaderElevation = bottomSheetY.interpolate({
    inputRange: [0, 0.005],
    outputRange: [3, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const minimizeBottomSheet = () => bottomSheetRef.current!.snapTo(1);

  // extended keeps track of whether the Bottom Sheet is extended
  let extended = false;

  // Since Animated runs on the native thread (if you use useNativeDriver)
  // you have to use certain hooks to directly access and perform
  // operations with this value
  // - useCode is a hook to run code when a certain value is updated
  // - cond is a equivalent to an if else
  // - call is used to call a function
  // For example, here we check whether bottomSheetY is almost extended
  // and if it is, then toggle value of extended
  useCode(() => {
    return cond(
      lessThan(bottomSheetY, 0.1),
      call([], () => {
        extended = true;
      }),
      call([], () => {
        extended = false;
      }),
    );
  }, [bottomSheetY]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (!extended) {
          return false;
        } else {
          minimizeBottomSheet();
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [extended, minimizeBottomSheet]),
  );

  const { icon, name, shortName, description, detail, addresses } = getStrings(
    mapMarkerData,
    place,
  );

  const renderContent = () => {
    return (
      <View style={[explorerStyles.modalContainer, { minHeight }]}>
        <View style={explorerStyles.contentContainer}>
          <View style={explorerStyles.pullUpTabContainer}>
            <View style={explorerStyles.pullUpTab} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Animated.Text
                style={[
                  explorerStyles.modalTitle,
                  {
                    opacity: animatedSubtitleOpacity,
                  },
                ]}
                numberOfLines={2}
              >
                {name}
              </Animated.Text>
              <Animated.Text
                style={[explorerStyles.modalSubtitle, { opacity: animatedSubtitleOpacity }]}
              >
                {shortName ? `${shortName} · ` : null}
                {detail}
              </Animated.Text>
            </View>
            <Animated.View style={{ justifyContent: 'center', opacity: animatedSubtitleOpacity }}>
              <Icon name={icon} color={colors.icon} style={explorerStyles.modalIcon} />
            </Animated.View>
          </View>
        </View>
        {place && !reqState.map.loading && !reqState.map.error ? (
          <Animated.ScrollView
            bounces={false}
            style={{ flex: Platform.OS === 'ios' ? 1 : 0 }}
            scrollEnabled={
              Platform.OS === 'ios' ? cond(lessThan(bottomSheetY, 0.1), true, false) : true
            }
          >
            {/* HACK but whatever */}
            <Divider />
            {addresses.map((address) => (
              <View key={shortid()}>
                <InlineCard
                  icon="map-marker-outline"
                  iconColor={colors.primary}
                  title={address}
                  onPress={() => {
                    minimizeBottomSheet();
                    zoomToLocation(mapMarkerData.coordinates);
                  }}
                  compact
                />
                <Divider />
              </View>
            ))}
            {description ? <InlineCard title={description} /> : null}
            {place.type === 'school' ? (
              <ContentTabView
                searchParams={{ schools: [place.id] }}
                types={['articles', 'events', 'groups']}
              />
            ) : null}
          </Animated.ScrollView>
        ) : (
          <ActivityIndicator size="large" color={colors.primary} />
        )}
      </View>
    );
  };

  return (
    <>
      {/* Background fade out view */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          height: '100%',
          width: '100%',
          opacity: animatedBackgroundOpacity,
          backgroundColor: colors.background,
        }}
        pointerEvents="none"
      />
      {/* Actual modal */}
      <BottomSheet
        ref={bottomSheetRef}
        useInsets
        callbackNode={bottomSheetY}
        portraitSnapPoints={bottomSheetPortraitSnapPoints}
        landscapeSnapPoints={bottomSheetLandscapeSnapPoints}
        renderContent={renderContent}
        onCloseEnd={onCloseEnd}
      />
      {/* Header component for the modal */}
      <Animated.View
        style={{
          position: 'absolute',
          zIndex: 100,
          top: 0,
          paddingTop: insets.top,
          height: 56 + insets.top,
          width: '100%',
          opacity: animatedHeaderOpacity,
          elevation: animatedHeaderElevation,
          backgroundColor: colors.background,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        // only allow onPress events if bottomSheet is almost fully extended
        pointerEvents={cond(greaterThan(bottomSheetY, 0.1), 'none', 'auto')}
      >
        <PlatformBackButton onPress={minimizeBottomSheet} />
        <Text numberOfLines={1} style={[explorerStyles.modalTitle, { paddingLeft: 10 }]}>
          {name}
        </Text>
      </Animated.View>
    </>
  );
};

const mapStateToProps = (state: State) => {
  const { places } = state;
  return { places: places.mapData, reqState: places.state };
};

export default connect(mapStateToProps)(LocationBottomSheet);
