import { useDimensions } from '@react-native-community/hooks';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  BackHandler,
} from 'react-native';
import { Divider, Text, Card, Title, Subheading, IconButton } from 'react-native-paper';
import Animated, { call } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import shortid from 'shortid';

import { BottomSheet, BottomSheetRef, InlineCard, PlatformBackButton } from '@components/index';
import places from '@src/data/explorerListData.json';
import { ExplorerLocation } from '@ts/types';
import { useTheme, logger, useSafeAreaInsets } from '@utils/index';

import getExplorerStyles from '../styles/Styles';
import { getStrings } from '../utils/getStrings';
import type { MapMarkerDataType } from '../views/Map';

const bottomSheetPortraitSnapPoints = [0, 210, '103.5%'];
const bottomSheetLandscapeSnapPoints = [0, 210, '103.5%'];

// function LocationEvent({ title, summary, imageUrl, date }) {
//   const styles = getStyles(useTheme());
//   const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
//   return (
//     <Card style={styles.card}>
//       <Touchable onPress={() => logger.warn('Navigate to event')}>
//         <View style={{ padding: 10 }}>
//           <Title
//             style={[styles.cardTitle, { marginBottom: 0 }]}
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             {title}
//           </Title>
//           <View style={{ flexDirection: 'row' }}>
//             <Image
//               source={{ uri: imageUrl }}
//               style={{ width: 100, height: 100, alignSelf: 'center' }}
//               resizeMode="contain"
//             />
//             <View style={{ margin: 10, width: '70%' }}>
//               <Text style={{ color: 'gray', fontSize: 16 }}>
//                 {_.capitalize(moment(date).fromNow())}
//               </Text>
//               <Text style={{ fontSize: 16 }} ellipsizeMode="tail" numberOfLines={3}>
//                 {summary}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </Touchable>
//     </Card>
//   );
// }

type LocationBottomSheetProps = {
  bottomSheetRef?: React.RefObject<BottomSheetRef>;
  mapMarkerData: MapMarkerDataType;
  zoomToLocation: (coordinates: [number, number]) => void;
};

const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  bottomSheetRef: propBottomSheetRef,
  mapMarkerData,
  zoomToLocation,
}) => {
  const bottomSheetRef = propBottomSheetRef ?? React.createRef<BottomSheetRef>();
  const theme = useTheme();
  const explorerStyles = getExplorerStyles(theme);
  const { colors } = theme;

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const minHeight = useDimensions().window.height - 21;

  const place = (places.find(
    (t) => t.data._id === mapMarkerData.id,
  ) as unknown) as ExplorerLocation.Location;

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

  // TODO: Implement back handler
  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('NAV TO BOTTOMSHEET');
  //     const onBackPress = () => {
  //       const isBottomSheetOpen = Animated.cond(
  //         Animated.eq(bottomSheetY, 1),
  //         call([], () => true),
  //         call([], () => false),
  //       );
  //       if (isBottomSheetOpen) {
  //         return false;
  //       } else {
  //         minimizeBottomSheet();
  //         return true;
  //       }
  //     };

  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //     return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   }, [minimizeBottomSheet]),
  // );

  if (!place) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Chargement du lieu</Text>
      </View>
    );
  }

  const { icon, title, subtitle, description, detail, addresses } = getStrings(place);

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
                {title}
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
                onPress={() => zoomToLocation(mapMarkerData.coordinates)}
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
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          height: '100%',
          width: '100%',
          opacity: animatedBackgroundOpacity,
          backgroundColor: colors.background,
        }}
      />
      <BottomSheet
        ref={bottomSheetRef}
        callbackNode={bottomSheetY}
        portraitSnapPoints={bottomSheetPortraitSnapPoints}
        landscapeSnapPoints={bottomSheetLandscapeSnapPoints}
        renderContent={renderContent}
      />
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
      >
        <PlatformBackButton onPress={minimizeBottomSheet} />
        <Text numberOfLines={1} style={[explorerStyles.modalTitle, { paddingLeft: 65 }]}>
          {title}
        </Text>
      </Animated.View>
    </>
  );
};

export default LocationBottomSheet;
