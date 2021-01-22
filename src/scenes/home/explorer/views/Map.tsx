import MapboxGL, { OnPressEvent } from '@react-native-mapbox-gl/maps';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import React from 'react';
import { View, Linking, Platform } from 'react-native';
import { Text, FAB, IconButton } from 'react-native-paper';

import { BottomSheetRef } from '@components/index';
import { fetchMapLocations } from '@redux/actions/api/places';
import getStyles from '@styles/Styles';
import { MapLocation } from '@ts/types';
import { useTheme, logger, useSafeAreaInsets, Location } from '@utils/index';

import { HomeTwoScreenNavigationProp } from '../../HomeTwo';
import LocationBottomSheet from '../components/LocationBottomSheet';
import getExplorerStyles from '../styles/Styles';
import { markerImages } from '../utils/assets';
import { buildFeatureCollections } from '../utils/featureCollection';

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

  const theme = useTheme();
  const { dark, colors } = theme;
  const explorerStyles = getExplorerStyles(theme);

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

  const zoomToUserSchool = () => zoomToLocation(mapConfig.centerCoordinate, mapConfig.defaultZoom);

  const zoomToLocation = (coordinates: [number, number], zoomLevel: number = 16) => {
    cameraRef.current!.setCamera({
      centerCoordinate: coordinates,
      animationDuration: 2000,
      zoomLevel,
      animationMode: 'flyTo',
      heading: 0,
    });
  };

  const partialOpenBottomSheet = () => bottomSheetRef.current?.snapTo(1);
  const closeBottomSheet = () => bottomSheetRef.current?.snapTo(0);

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <MapboxGL.MapView
        style={{ flex: 1 }}
        onPress={closeBottomSheet}
        logoEnabled={false}
        scrollEnabled
        attributionEnabled={false}
        pitchEnabled={false}
        styleURL={tileServerUrl}
        compassViewMargins={{
          x: 10,
          y: insets.top * 1.5 + 10,
        }}
        onRegionIsChanging={({ properties }) => {
          lastZoomLevel.current = properties.zoomLevel;
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
                ['get', 'associatedEvents'],
                dark ? 'pinPurpleDark' : 'pinPurpleLight',
                1,
                dark ? 'pinPurpleDarkWithEvent' : 'pinPurpleLightWithEvent',
              ],
              iconSize: ['step', ['get', 'associatedEvents'], 1, 1, 1.15],
              iconAnchor: 'bottom',
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
                ['get', 'associatedEvents'],
                dark ? 'pinPurpleStarDark' : 'pinPurpleStarLight',
                1,
                dark ? 'pinPurpleStarDarkWithEvent' : 'pinPurpleStarLightWithEvent',
              ],
              iconSize: ['step', ['get', 'associatedEvents'], 1, 1, 1.15],
              iconAnchor: 'bottom',
            }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.UserLocation visible={userLocation} animated />
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
            style={explorerStyles.fab}
            color={colors.primary}
            icon={fabState === 'user' ? 'crosshairs-gps' : 'school'}
            onPress={fabState === 'user' ? requestUserLocation : zoomToUserSchool}
            onLongPress={fabState === 'user' ? zoomToUserSchool : undefined}
          />
        </View>
      ) : null}

      <ExplorerAttribution />

      <LocationBottomSheet
        bottomSheetRef={bottomSheetRef}
        mapMarkerData={selectedLocation}
        zoomToLocation={zoomToLocation}
      />
    </View>
  );
};

function ExplorerAttribution() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const explorerStyles = getExplorerStyles(theme);
  return (
    <View style={explorerStyles.attributionContainer}>
      <Text style={[explorerStyles.attribution, explorerStyles.atributionMutedColor]}> © </Text>
      <Text
        onPress={() => Linking.openURL('https://openmaptiles.org/')}
        style={[styles.link, explorerStyles.attribution]}
      >
        OpenMapTiles
      </Text>
      <Text style={[explorerStyles.attribution, explorerStyles.atributionMutedColor]}> © </Text>
      <Text
        onPress={() => Linking.openURL('https://www.openstreetmap.org/copyright')}
        style={[styles.link, explorerStyles.attribution]}
      >
        OpenStreetMap
      </Text>
      <Text style={[explorerStyles.attribution, explorerStyles.atributionMutedColor]}>
        {' '}
        contributors{' '}
      </Text>
    </View>
  );
}

export default ExplorerMap;
