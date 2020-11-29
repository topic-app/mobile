import MapboxGL, { OnPressEvent } from '@react-native-mapbox-gl/maps';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import * as Location from 'expo-location';
import React from 'react';
import { View, Linking, Platform } from 'react-native';
import { Text, FAB, IconButton } from 'react-native-paper';

import { BottomSheetRef } from '@components/index';
import getStyles from '@styles/Styles';
import { ExplorerLocation } from '@ts/types';
import { useTheme, logger, useSafeAreaInsets } from '@utils/index';

import { HomeTwoScreenNavigationProp } from '../../HomeTwo';
import LocationBottomSheet from '../components/LocationBottomSheet';
import getExplorerStyles from '../styles/Styles';
import { buildFeatureCollections } from '../utils/featureCollection';
import { markerImages } from '../utils/getAsset';

MapboxGL.setAccessToken('DO-NOT-REMOVE-ME');
// MapboxGL.setTelemetryEnabled(false);

export type MapMarkerDataType = {
  id: string | number;
  type: ExplorerLocation.LocationTypes;
  name: string;
  coordinates: [number, number];
};

type ExplorerMapProps = {
  places: ExplorerLocation.Location[];
  map: {
    minZoom: number;
    maxZoom: number;
    defaultZoom: number;
    centerCoordinate: [number, number];
    bounds: { ne: [number, number]; sw: [number, number] };
  };
  tileServerUrl: string;
  navigation: HomeTwoScreenNavigationProp<'Explorer'>;
};

const ExplorerMap: React.FC<ExplorerMapProps> = ({ places, map, tileServerUrl, navigation }) => {
  const cameraRef = React.createRef<MapboxGL.Camera>();
  const bottomSheetRef = React.createRef<BottomSheetRef>();

  const [data, setData] = React.useState<MapMarkerDataType>({
    id: '',
    type: 'school',
    name: '',
    coordinates: [0, 0],
  });
  const [userLocation, setUserLocation] = React.useState(false);
  const [fabVisible, setFabVisible] = React.useState(false);

  const theme = useTheme();
  const { colors } = theme;
  const explorerStyles = getExplorerStyles(theme);

  React.useEffect(() => {
    // Check if Location is requestable
    // If it is, then show the FAB to go to location
    Location.getPermissionsAsync()
      .then(({ status, canAskAgain }) => {
        // User previously granted permission
        if (status === Location.PermissionStatus.GRANTED) {
          logger.verbose('Location previously granted, showing location FAB');
          setFabVisible(true);
          setUserLocation(true);
        } else if (status === Location.PermissionStatus.DENIED && canAskAgain) {
          logger.info('Location previously denied but can ask again, showing location FAB');
          setFabVisible(true);
        } else {
          logger.info('Location denied, hiding location FAB');
        }
      })
      .catch((e) => logger.warn('Error while requesting user location permission', e));
  }, []);

  const onMarkerPress = (event: OnPressEvent) => {
    logger.verbose('explorer/Map: Pressed on marker');
    const { id, geometry, properties } = event.features[0];
    if (geometry.type === 'Point') {
      const coordinates = geometry.coordinates as [number, number];
      cameraRef.current?.moveTo(coordinates, 100);
      setData({
        id: id!,
        type: properties?.type,
        name: properties?.name,
        coordinates,
      });
      partialOpenBottomSheet();
    }
  };

  const requestUserLocation = async () => {
    let status = Location.PermissionStatus.UNDETERMINED;
    try {
      status = (await Location.requestPermissionsAsync()).status;
    } catch (e) {
      logger.warn('Error while requesting user location', e);
    }
    if (status === Location.PermissionStatus.GRANTED) {
      const { coords } = await Location.getCurrentPositionAsync({});
      cameraRef.current?.setCamera({
        centerCoordinate: [coords.longitude, coords.latitude],
        zoomLevel: 11,
        animationDuration: 700,
      });
    } else {
      setFabVisible(false);
      logger.info('Location permission request prompt denied, hiding location FAB.');
    }
  };

  const zoomToLocation = (coordinates: [number, number]) => {
    cameraRef.current?.setCamera({
      centerCoordinate: coordinates,
      animationDuration: 2000,
      zoomLevel: 16,
      animationMode: 'flyTo',
      heading: 0,
    });
  };

  const partialOpenBottomSheet = () => bottomSheetRef.current?.snapTo(1);
  const closeBottomSheet = () => bottomSheetRef.current?.snapTo(0);

  const featureCollections = buildFeatureCollections(places);

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        marginBottom:
          Platform.OS === 'ios'
            ? insets.bottom + 50
            : 0 /* 50 is the height of the tabBar on iOS */,
      }}
    >
      <MapboxGL.MapView
        style={{ flex: 1 }}
        onPress={closeBottomSheet}
        logoEnabled={false}
        attributionEnabled={false}
        pitchEnabled={false}
        styleURL={tileServerUrl}
        compassViewMargins={{
          x: 10,
          y: insets.top * 1.5 + 10,
        }}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          maxBounds={map.bounds}
          minZoomLevel={map.minZoom}
          maxZoomLevel={map.maxZoom}
          defaultSettings={{ centerCoordinate: map.centerCoordinate, zoomLevel: map.defaultZoom }}
        />
        <MapboxGL.Images images={markerImages} />
        <MapboxGL.ShapeSource
          id="secret-shape"
          shape={featureCollections.secret}
          onPress={onMarkerPress}
        >
          <MapboxGL.SymbolLayer
            id="secret-zoom1"
            minZoomLevel={19}
            style={{ iconImage: ['get', 'circleIcon'], iconSize: 1 }}
          />
        </MapboxGL.ShapeSource>
        {(['event', 'place'] as const).map((placeType) => {
          return (
            <MapboxGL.ShapeSource
              key={`${placeType}-shape`}
              id={`${placeType}-shape`}
              shape={featureCollections[placeType]}
              onPress={onMarkerPress}
            >
              <MapboxGL.SymbolLayer
                id={`${placeType}-zoom1`}
                maxZoomLevel={9}
                style={{ iconImage: ['get', 'circleIcon'], iconSize: 0.3 }}
              />
              <MapboxGL.SymbolLayer
                id={`${placeType}-zoom2`}
                minZoomLevel={9}
                style={{ iconImage: ['get', 'pinIcon'], iconSize: 1, iconAnchor: 'bottom' }}
              />
            </MapboxGL.ShapeSource>
          );
        })}
        <MapboxGL.ShapeSource
          id="school-shape"
          shape={featureCollections.school}
          onPress={onMarkerPress}
        >
          <MapboxGL.SymbolLayer
            id="school-zoom1"
            maxZoomLevel={9}
            style={{ iconImage: ['get', 'circleIcon'], iconSize: 0.3 }}
          />
          <MapboxGL.SymbolLayer
            id="school-zoom2"
            minZoomLevel={9}
            style={{ iconImage: ['get', 'pinIcon'], iconSize: 1, iconAnchor: 'bottom' }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource
          id="collection-shape"
          shape={featureCollections.collection}
          onPress={onMarkerPress}
        >
          <MapboxGL.SymbolLayer
            id="collection-zoom1"
            style={{ iconImage: ['get', 'circleIcon'], iconSize: 0.3 }}
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

      {fabVisible && (
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
            icon="crosshairs-gps"
            onPress={requestUserLocation}
          />
        </View>
      )}

      <ExplorerAttribution />

      <LocationBottomSheet
        bottomSheetRef={bottomSheetRef}
        mapMarkerData={data}
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
