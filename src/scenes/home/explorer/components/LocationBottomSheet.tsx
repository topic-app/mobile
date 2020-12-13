import { useFocusEffect } from '@react-navigation/core';
import React from 'react';
import { View, BackHandler, useWindowDimensions } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import Animated, { call, cond, greaterThan, lessThan, useCode } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import shortid from 'shortid';

import { BottomSheet, BottomSheetRef, InlineCard, PlatformBackButton } from '@components/index';
import placesTestData from '@src/data/explorerListData.json';
import { ExplorerLocation } from '@ts/types';
import { useTheme, logger, useSafeAreaInsets } from '@utils/index';

import getExplorerStyles from '../styles/Styles';
import { getStrings } from '../utils/getStrings';
import type { MapMarkerDataType } from '../views/Map';

const bottomSheetPortraitSnapPoints = [0, 210, '103.5%'];
const bottomSheetLandscapeSnapPoints = [0, 210, '103.5%'];

type LocationBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetRef>;
  mapMarkerData: MapMarkerDataType;
  zoomToLocation: (coordinates: [number, number]) => void;
  // Places that have already been fetched before
  // Right now it is not hooked up to redux, because I don't know
  // what places is, is it...
  // - Explorer.Location[]
  // - (Place | PlacePreload)[] ?
  places?: ExplorerLocation.Location[];
};

const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  bottomSheetRef,
  mapMarkerData,
  zoomToLocation,
  places = (placesTestData as unknown) as ExplorerLocation.Location[],
}) => {
  const theme = useTheme();
  const explorerStyles = getExplorerStyles(theme);
  const { colors } = theme;

  const insets = useSafeAreaInsets();
  const minHeight = useWindowDimensions().height - 21;

  // Search for desired place in places
  const place = places.find((loc) => loc.data._id === mapMarkerData.id);

  React.useEffect(() => {
    if (mapMarkerData.id !== '') {
      // Fetch location and add it to redux places
      // updateLocations(mapMarkerData.id);
      console.log('Get location with id', mapMarkerData.id);
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
        if (!extended) extended = true;
      }),
      call([], () => {
        if (extended) extended = false;
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

  const { icon, title, subtitle, description, detail, addresses } = getStrings(
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
                {place}
              </Animated.Text>
              <Animated.Text
                style={[explorerStyles.modalSubtitle, { opacity: animatedSubtitleOpacity }]}
              >
                {subtitle ? `${subtitle} · ` : null}
                {detail}
              </Animated.Text>
            </View>
            <Animated.View style={{ justifyContent: 'center', opacity: animatedSubtitleOpacity }}>
              <Icon name={icon} color={colors.icon} style={explorerStyles.modalIcon} />
            </Animated.View>
          </View>
        </View>
        <View>
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
          <InlineCard
            title={description}
            onPress={() => logger.verbose('Pressed location description')}
          />
        </View>
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
        callbackNode={bottomSheetY}
        portraitSnapPoints={bottomSheetPortraitSnapPoints}
        landscapeSnapPoints={bottomSheetLandscapeSnapPoints}
        renderContent={renderContent}
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
          {title}
        </Text>
      </Animated.View>
    </>
  );
};

export default LocationBottomSheet;
