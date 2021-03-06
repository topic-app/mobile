import MapboxGL, { OnPressEvent } from '@react-native-mapbox-gl/maps';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import _ from 'lodash';
import React from 'react';
import { View, Platform, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Text, FAB, IconButton, useTheme } from 'react-native-paper';
import Animated, { EasingNode, cond, greaterThan } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BottomSheetRef } from '@components';
import { fetchMapLocations } from '@redux/actions/api/places';
import { MapLocation } from '@ts/types';
import { logger, Location, handleUrl } from '@utils';

import { HomeTwoScreenNavigationProp } from '../HomeTwo';
import LocationBottomSheet from './components/LocationBottomSheet';
import getStyles from './styles';
import { markerImages } from './utils/assets';
import { buildFeatureCollections } from './utils/featureCollection';

MapboxGL.setAccessToken('DO-NOT-REMOVE-ME');
// MapboxGL.setTelemetryEnabled(false);

export type MapMarkerDataType = {
  id: string;
  type: MapLocation.PointDataType;
  name: string;
  coordinates: [number, number];
};

type ExplorerMapProps = {
  mapConfig: {
    minZoom: number;
    maxZoom: number;
    defaultZoom: number;
    centerCoordinate: [number, number];
    bounds: { ne: [number, number]; sw: [number, number] };
  };
  tileServerUrl: string;
  permanentPlaces: MapLocation.Point[];
  navigation: HomeTwoScreenNavigationProp<'Explorer'>;
};

const ExplorerMap: React.FC<ExplorerMapProps> = ({
  mapConfig,
  tileServerUrl,
  navigation,
  permanentPlaces,
}) => {
  const cameraRef = React.createRef<MapboxGL.Camera>();
  const bottomSheetRef = React.createRef<BottomSheetRef>();

  const [selectedLocation, setSelectedLocation] = React.useState<MapMarkerDataType>({
    id: '',
    type: 'school',
    name: '',
    coordinates: [0, 0],
  });
  const [places, setPlaces] = React.useState<MapLocation.Element[]>([]);
  // Build appropriate FeatureCollections from places
  const featureCollections = buildFeatureCollections(places);
  const [userLocation, setUserLocation] = React.useState(false);
  const [fabState, setFabState] = React.useState<'hidden' | 'school' | 'user'>('hidden');

  const lastRequestParams = React.useRef<{
    bounds: [[number, number], [number, number]];
    zoom: number;
  }>({ bounds: [mapConfig.bounds.ne, mapConfig.bounds.sw], zoom: mapConfig.defaultZoom });

  const lastZoomLevel = React.useRef(mapConfig.minZoom);
  const headingAnim = React.useRef(new Animated.Value<number>(0)).current;
  const compassRotateAnim = (headingAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['360deg', '0deg'],
  }) as unknown) as Animated.Node<string>;

  const theme = useTheme();
  const { dark, colors } = theme;
  const styles = getStyles(theme);

  React.useEffect(() => {
    // Check if Location is requestable
    // If it is, then show the FAB to go to location
    Location.getStatus().then(async (status) => {
      if (status === 'yes') {
        logger.verbose('Location previously granted, showing location FAB');
        setFabState('user');
        setUserLocation(true);
      } else if (status === 'no') {
        logger.info('Location previously denied but can ask again, showing location FAB');
        setFabState('user');
      } else if (status === 'never') {
        if (permanentPlaces.length !== 0) {
          setFabState('school');
        }
      }
    });
  }, []);

  const onMarkerPress = (event: OnPressEvent) => {
    logger.verbose('explorer/Map: Pressed on marker');
    const { id, geometry, properties } = event.features[0];
    if (geometry.type === 'Point') {
      const coordinates = geometry.coordinates as [number, number];
      if (properties?.cluster || typeof id === 'number') {
        closeBottomSheet();
        cameraRef.current!.setCamera({
          centerCoordinate: coordinates,
          zoomLevel: Math.min(lastZoomLevel.current + 1, mapConfig.maxZoom),
          animationDuration: 700,
        });
      } else {
        if (lastZoomLevel.current < 15) {
          cameraRef.current!.setCamera({
            centerCoordinate: coordinates,
            zoomLevel: 15,
            animationDuration: 1500,
            animationMode: 'flyTo',
          });
        } else {
          cameraRef.current!.moveTo(coordinates, 700);
        }
        if (id === selectedLocation.id) {
          // User pressed on the already selected location
          partialOpenBottomSheet();
        } else {
          setSelectedLocation({
            id: id!,
            type: properties?.dataType,
            name: properties?.name,
            coordinates,
          });
          // Note: below React.useEffect watches selectedLocation
          // and displays the bottom sheet when selectedLocation changes
        }
      }
    }
  };

  // Open bottom sheet if selected location changes
  React.useEffect(() => {
    if (selectedLocation.id !== '') {
      partialOpenBottomSheet();
    }
  }, [selectedLocation.id]);

  const requestUserLocation = async () => {
    Location.request().then(async (status) => {
      if (status === 'yes') {
        const coords = await Location.getCoordinates();
        cameraRef.current?.setCamera({
          centerCoordinate: [coords.longitude, coords.latitude],
          zoomLevel: 14,
          animationDuration: 2000,
          animationMode: 'flyTo',
        });
        setUserLocation(true);
      } else {
        if (permanentPlaces.length !== 0) {
          setFabState('school');
        } else {
          setFabState('hidden');
        }
        logger.info('Location permission request prompt denied, hiding location FAB.');
      }
    });
  };

  const zoomToUserSchool = () => {
    zoomToLocation(mapConfig.centerCoordinate, mapConfig.defaultZoom);
    if (permanentPlaces.length) {
      const { id, properties, geometry } = permanentPlaces[0];
      setSelectedLocation({
        id,
        type: properties.dataType,
        name: properties.name,
        coordinates: geometry.coordinates,
      });
    }
  };

  const zoomToLocation = (coordinates: [number, number], zoomLevel: number = 16) => {
    cameraRef.current!.setCamera({
      centerCoordinate: coordinates,
      animationDuration: 2000,
      zoomLevel,
      animationMode: 'flyTo',
      heading: 0,
    });
  };

  const zoom = (amt: number, duration = 200) => {
    cameraRef.current?.zoomTo(
      _.clamp(lastZoomLevel.current + amt, mapConfig.minZoom, mapConfig.maxZoom),
      duration,
    );
  };

  // Show/hide zoom buttons
  const zoomVisible = React.useRef(false);
  const zoomAnim = React.useRef(new Animated.Value(0)).current;
  const hideZoomButtons = () => {
    zoomVisible.current = false;
    Animated.timing(zoomAnim, {
      toValue: 0,
      duration: 200,
      easing: EasingNode.linear,
    }).start();
  };
  const showZoomButtons = () => {
    zoomVisible.current = true;
    Animated.timing(zoomAnim, {
      toValue: 1,
      duration: 200,
      easing: EasingNode.linear, // Easing.linear,
    }).start();
  };
  const zoomElevationAnim = zoomAnim.interpolate({
    inputRange: [0.7, 1],
    outputRange: [0, 2],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const zoomOpacityAnim = zoomAnim.interpolate({
    inputRange: [0, 0.9],
    outputRange: [0, 1],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const bottomSheetOpen = React.useRef(false);
  const partialOpenBottomSheet = () => {
    bottomSheetOpen.current = true;
    bottomSheetRef.current?.snapTo(1);
  };
  // Note: bottomSheetOpen is changed by onCloseEnd in <LocationBottomSheet />
  //       towards the bottom of this component
  const closeBottomSheet = () => bottomSheetRef.current?.snapTo(0);

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        style={{ flex: 1 }}
        onPress={() => {
          if (bottomSheetOpen.current) {
            closeBottomSheet();
          } else {
            // Toggle zoom buttons if bottom sheet is not open
            if (zoomVisible.current) {
              hideZoomButtons();
            } else {
              showZoomButtons();
            }
          }
        }}
        logoEnabled={false}
        scrollEnabled
        attributionEnabled={false}
        pitchEnabled={false}
        styleURL={tileServerUrl}
        compassEnabled={false}
        onRegionIsChanging={({ properties }) => {
          lastZoomLevel.current = properties.zoomLevel;
          headingAnim.setValue(properties.heading);
        }}
        onRegionDidChange={({ properties }) => {
          const { visibleBounds, zoomLevel } = properties;

          // bounds = [[eastLng, northLat], [westLng, southLat]]
          const { bounds: lastBounds, zoom: lastZoom } = lastRequestParams.current;

          // Each time the region changes, a request is made for the specific bounds
          // that the user is looking at. At each request, these bounds are enlarged
          // to allow for the user panning around with minimal loading.
          // This next if statement checks if the user is still seeing points from
          // the last enlarged bounds. If the user decides to pan out of the bounds
          // or if the user decides to zoom in or out, then fetch new points
          if (
            !(visibleBounds[0][0] < lastBounds[0][0] && visibleBounds[1][0] > lastBounds[1][0]) ||
            !(visibleBounds[0][1] < lastBounds[0][1] && visibleBounds[1][1] > lastBounds[1][1]) ||
            Math.abs(lastZoom - zoomLevel) > 0.3
          ) {
            logger.verbose('explorer/Map: Bounds changed, requesting new points.');
            const bounds = visibleBounds as [[number, number], [number, number]];

            // Get the "height" and "width" of bounds (in latitude and longitude)
            const lngDiff = Math.abs(bounds[0][0] - bounds[1][0]);
            const latDiff = Math.abs(bounds[0][1] - bounds[1][1]);

            // Add those to the bounds to enlarge them
            bounds[0][0] += lngDiff;
            bounds[1][0] -= lngDiff;
            bounds[0][1] += latDiff / 2;
            bounds[1][1] -= latDiff / 2;

            lastRequestParams.current.bounds = bounds;
            lastRequestParams.current.zoom = zoomLevel;

            // Round bounds to 5 decimal places (accuracy of 1.1m)
            // see https://en.wikipedia.org/wiki/Decimal_degrees for info on accuracy
            const reqBounds = bounds.flat().map((b) => parseFloat(b.toFixed(5))) as [
              number,
              number,
              number,
              number,
            ];

            fetchMapLocations(...reqBounds, Math.floor(zoomLevel))
              .then(setPlaces)
              .catch((e) => logger.warn('Error while fetching new locations in explorer/Map', e));
          } else {
            logger.verbose('explorer/Map: Bounds changed very little, skipping request.');
          }
        }}
        // Change this to set how soon onRegionDidChange is called
        regionDidChangeDebounceTime={500}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          maxBounds={Platform.OS === 'ios' ? undefined : mapConfig.bounds}
          minZoomLevel={mapConfig.minZoom}
          maxZoomLevel={mapConfig.maxZoom}
          defaultSettings={{
            centerCoordinate: mapConfig.centerCoordinate,
            zoomLevel: mapConfig.defaultZoom,
          }}
        />
        <MapboxGL.Images images={markerImages} />
        {/* <MapboxGL.ShapeSource
          id="secret-shape"
          shape={featureCollections.secret}
          onPress={onMarkerPress}
        >
          <MapboxGL.SymbolLayer
            id="secret-zoom1"
            minZoomLevel={19}
            style={{ iconImage: ['get', 'circleIcon'], iconSize: 1 }}
          />
        </MapboxGL.ShapeSource> */}
        <MapboxGL.ShapeSource
          id="place-shape"
          shape={featureCollections.place}
          onPress={onMarkerPress}
        >
          <MapboxGL.SymbolLayer
            id="place-symbol"
            style={{
              iconImage: dark ? 'pinRedDark' : 'pinRedLight',
              iconSize: 1,
              iconAnchor: 'bottom',
            }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="school-shape"
          shape={featureCollections.school}
          onPress={onMarkerPress}
        >
          <MapboxGL.SymbolLayer
            id="school-symbol"
            style={{
              iconImage: [
                'step',
                ['get', 'events'],
                dark ? 'pinPurpleDark' : 'pinPurpleLight',
                1,
                dark ? 'pinPurpleDarkWithEvent' : 'pinPurpleLightWithEvent',
              ],
              iconSize: ['step', ['get', 'events'], 1, 1, 1.15],
              iconAnchor: 'bottom',
              iconOpacity: ['case', ['get', 'active'], 1, 0.5],
            }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="event-shape"
          shape={featureCollections.event}
          onPress={onMarkerPress}
        >
          <MapboxGL.SymbolLayer
            id="event-symbol"
            style={{
              iconImage: dark ? 'pinGreenDark' : 'pinGreenLight',
              iconSize: 1,
              iconAnchor: 'bottom',
            }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="cluster-shape"
          shape={featureCollections.cluster}
          onPress={onMarkerPress}
        >
          <MapboxGL.SymbolLayer
            id="cluster-symbol"
            style={{
              iconImage: dark ? 'circleDark' : 'circleLight',
              iconSize: 1,
              textField: ['get', 'point_count_abbreviated'],
              textFont: ['Noto Sans Regular'],
              textSize: 15,
              textColor: colors.text,
            }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="permanent-school-shape"
          shape={{ type: 'FeatureCollection', features: permanentPlaces }}
          onPress={onMarkerPress}
        >
          <MapboxGL.SymbolLayer
            id="permanent-school-symbol"
            style={{
              iconImage: [
                'step',
                ['get', 'events'],
                dark ? 'pinPurpleStarDark' : 'pinPurpleStarLight',
                1,
                dark ? 'pinPurpleStarDarkWithEvent' : 'pinPurpleStarLightWithEvent',
              ],
              iconSize: ['step', ['get', 'events'], 1, 1, 1.15],
              iconAnchor: 'bottom',
            }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.UserLocation visible={userLocation} animated onPress={requestUserLocation} />
      </MapboxGL.MapView>

      {Platform.OS !== 'ios' ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            paddingTop: 34,
            paddingLeft: 4,
          }}
        >
          <IconButton
            onPress={((navigation as unknown) as DrawerNavigationProp<any, any>).openDrawer}
            icon="menu"
            color={colors.text}
            size={24}
          />
        </View>
      ) : null}

      {fabState !== 'hidden' ? (
        <View
          style={{
            zIndex: 0,
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}
        >
          <FAB
            style={styles.fab}
            color={colors.primary}
            icon={fabState === 'user' ? 'crosshairs-gps' : 'school'}
            onPress={fabState === 'user' ? requestUserLocation : zoomToUserSchool}
            onLongPress={fabState === 'user' ? zoomToUserSchool : undefined}
          />
        </View>
      ) : null}

      <Animated.View
        style={{
          zIndex: 0,
          position: 'absolute',
          top: insets.top + 8,
          right: 15,
          opacity: zoomOpacityAnim,
        }}
        // Disable touchables if zoom buttons are not visible
        pointerEvents={cond(greaterThan(zoomOpacityAnim, 0), 'auto', 'none')}
      >
        <Animated.View style={[styles.zoomButton, { elevation: zoomElevationAnim }]}>
          <TouchableWithoutFeedback
            onPress={() => cameraRef.current?.setCamera({ heading: 0, animationDuration: 200 })}
          >
            <Animated.View style={{ transform: [{ rotate: compassRotateAnim }] }}>
              <Image
                source={require('@assets/images/explorer/compass-icon.png')}
                style={{ height: 27 }}
                resizeMode="contain"
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
        <Animated.View style={[styles.zoomButton, { elevation: zoomElevationAnim }]}>
          <TouchableWithoutFeedback onPress={() => zoom(1)}>
            <Icon name="plus" color={colors.text} size={23} />
          </TouchableWithoutFeedback>
        </Animated.View>
        <Animated.View style={[styles.zoomButton, { elevation: zoomElevationAnim }]}>
          <TouchableWithoutFeedback onPress={() => zoom(-1)}>
            <Icon name="minus" color={colors.text} size={23} />
          </TouchableWithoutFeedback>
        </Animated.View>
      </Animated.View>

      <ExplorerAttribution />

      <LocationBottomSheet
        bottomSheetRef={bottomSheetRef}
        mapMarkerData={selectedLocation}
        zoomToLocation={zoomToLocation}
        onCloseEnd={() => {
          bottomSheetOpen.current = false;
        }}
      />
    </View>
  );
};

const ExplorerAttribution: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.attributionContainer}>
      <Text style={[styles.attribution, styles.atributionMutedColor]}> ?? </Text>
      <Text
        onPress={() => handleUrl('https://openmaptiles.org/', { trusted: true })}
        style={[styles.link, styles.attribution]}
      >
        OpenMapTiles
      </Text>
      <Text style={[styles.attribution, styles.atributionMutedColor]}> ?? </Text>
      <Text
        onPress={() => handleUrl('https://www.openstreetmap.org/copyright', { trusted: true })}
        style={[styles.link, styles.attribution]}
      >
        OpenStreetMap
      </Text>
      <Text style={[styles.attribution, styles.atributionMutedColor]}> contributors </Text>
    </View>
  );
};

export default ExplorerMap;
