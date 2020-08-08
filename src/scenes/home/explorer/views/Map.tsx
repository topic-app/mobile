import React from 'react';
import { View, Linking, Platform } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { Text, FAB, IconButton, useTheme } from 'react-native-paper';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNLocation from 'react-native-location';

import getStyles from '@styles/Styles';
import { TranslucentStatusBar } from '@components/Header';

import LocationModal from '../components/LocationModal';
import { buildFeatureCollections } from '../utils/featureCollection';
import { markerImages } from '../utils/getAsset';
import getExplorerStyles from '../styles/Styles';

MapboxGL.setAccessToken('DO-NOT-REMOVE-ME');
RNLocation.configure({
  androidProvider: 'standard', // Don't pass by Google Location Services
});

function ExplorerMap({ places, map, tileServerUrl, navigation }) {
  const cameraRef = React.createRef();

  const [data, setData] = React.useState({ id: null, type: null, name: null });
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [userLocation, setUserLocation] = React.useState(false);
  const [fabVisible, setFabVisible] = React.useState(false);

  const theme = useTheme();
  const { colors } = theme;
  const explorerStyles = getExplorerStyles(theme);

  React.useEffect(() => {
    // Check if Location is requestable
    // If it is, then show the FAB to go to location
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    )
      .then((result) => {
        switch (result) {
          case RESULTS.GRANTED: // Location granted
            setFabVisible(true);
            setUserLocation(true);
            break;
          case RESULTS.DENIED: // Location not yet requested / can still ask
            setFabVisible(true);
            break;
          default:
            console.warn('Location unavailable / blocked');
        }
      })
      .catch((error) => {
        console.error('Error while checking location\n', error);
      });
  }, []);

  const onMarkerPress = ({ features }) => {
    const feature = features[0];
    const { coordinates } = feature.geometry;
    cameraRef.current.moveTo(coordinates, 100);
    setData({
      id: feature.id,
      type: feature.properties.type,
      name: feature.properties.name,
    });
    setModalVisible(true);
  };

  const requestUserLocation = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    )
      .then((result) => {
        if (result === RESULTS.GRANTED) {
          setUserLocation(true);
          RNLocation.getLatestLocation({ timeout: 60000 }).then((location) => {
            const { longitude, latitude } = location;
            cameraRef.current.setCamera({
              centerCoordinate: [longitude, latitude],
              zoomLevel: 11,
              animationDuration: 700,
            });
          });
        } else {
          setFabVisible(false);
        }
      })
      .catch((error) => {
        console.error('Error while requesting location\n', error);
      });
  };

  const featureCollections = buildFeatureCollections(places);

  const insets = useSafeArea();

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
        onPress={() => setModalVisible(false)}
        logoEnabled={false}
        attributionEnabled={false}
        pitchEnabled={false}
        showUserLocation
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
        {featureCollections.map((fc) => {
          if (fc.collectionType === 'secret') {
            return (
              <MapboxGL.ShapeSource key="secret" id="secret" shape={fc} onPress={onMarkerPress}>
                <MapboxGL.SymbolLayer
                  id="secret-zoom1"
                  minZoomLevel={19}
                  style={{ iconImage: ['get', 'circleIcon'], iconSize: 1 }}
                />
              </MapboxGL.ShapeSource>
            );
          }
          return (
            <MapboxGL.ShapeSource
              key={fc.collectionType}
              id={fc.collectionType}
              shape={fc}
              onPress={onMarkerPress}
            >
              <MapboxGL.SymbolLayer
                id={`${fc.collectionType}-zoom1`}
                maxZoomLevel={9}
                style={{ iconImage: ['get', 'circleIcon'], iconSize: 0.3 }}
              />
              <MapboxGL.SymbolLayer
                id={`${fc.collectionType}-zoom2`}
                minZoomLevel={9}
                style={{ iconImage: ['get', 'pinIcon'], iconSize: 1, iconAnchor: 'bottom' }}
              />
            </MapboxGL.ShapeSource>
          );
        })}
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
            onPress={() => navigation.openDrawer()}
            icon="menu"
            color={colors.text}
            size={24}
          />
        </View>
      ) : (
        <TranslucentStatusBar />
      )}

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

      <ExplorerAttribution theme={theme} />

      <Modal
        supportedOrientations={['portrait', 'landscape']}
        isVisible={isModalVisible}
        hasBackdrop={false}
        onBackButtonPress={() => setModalVisible(false)}
        coverScreen={false}
        animationOutTiming={200} // We want it to dissapear fast
        style={explorerStyles.modal}
      >
        <LocationModal data={data} hideModal={() => setModalVisible(false)} />
      </Modal>
    </View>
  );
}

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

ExplorerMap.propTypes = {
  places: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      position: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  ).isRequired,
  map: PropTypes.shape({
    minZoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number.isRequired,
    defaultZoom: PropTypes.number.isRequired,
    centerCoordinate: PropTypes.arrayOf(PropTypes.number).isRequired,
    bounds: PropTypes.shape({
      ne: PropTypes.arrayOf(PropTypes.number).isRequired,
      sw: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
  }).isRequired,
  tileServerUrl: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    openDrawer: PropTypes.func,
  }).isRequired,
};
