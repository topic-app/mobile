import React from 'react';
import { View, Linking, StatusBar, Platform } from 'react-native';
import { Text, FAB, IconButton } from 'react-native-paper';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNLocation from 'react-native-location';

import LocationModal from '../components/LocationModal';
import { getImageName, markerImages } from '../utils/getAssetColor';

import { styles, colors } from '../../../../styles/Styles';
import { explorerStyles } from '../styles/Styles';

MapboxGL.setAccessToken('DO-NOT-REMOVE-ME');
RNLocation.configure({
  androidProvider: 'standard',
});

class ExplorerMap extends React.Component {
  camera = React.createRef();

  constructor(props) {
    super(props);
    this.onMarkerPress = this.onMarkerPress.bind(this);
    this.state = {
      data: {
        id: '',
        type: '',
        name: '',
      },
      isModalVisible: false,
      userLocation: false,
      fabVisible: false,
    };

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
            this.setState({ fabVisible: true });
            this.setState({ userLocation: true });
            break;
          case RESULTS.DENIED: // Location not yet requested / can still ask
            this.setState({ fabVisible: true });
            break;
          default:
            console.warn('Location unavailable / blocked');
        }
      })
      .catch((error) => {
        console.error('Error while checking location\n', error);
      });
  }

  onMarkerPress({ features }) {
    const feature = features[0];
    const { coordinates } = feature.geometry;
    this.camera.current.moveTo(coordinates, 100);
    this.setState({
      data: {
        id: feature.id,
        type: feature.properties.type,
        name: feature.properties.name,
      },
      isModalVisible: true,
    });
  }

  requestUserLocation = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    )
      .then((result) => {
        if (result === RESULTS.GRANTED) {
          this.setState({ userLocation: true });
          RNLocation.getLatestLocation({ timeout: 60000 }).then((location) => {
            const { longitude, latitude } = location;
            this.camera.current.setCamera({
              centerCoordinate: [longitude, latitude],
              zoomLevel: 11,
              animationDuration: 700,
            });
          });
        } else {
          this.setState({ fabVisible: false });
        }
      })
      .catch((error) => {
        console.error('Error while requesting location\n', error);
      });
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    let secret = {};
    const { places } = this.props;
    places.forEach((place) => {
      if (place.type !== 'secret') {
        featureCollection.features.push({
          type: 'Feature',
          id: place.id,
          properties: {
            name: place.name,
            type: place.type,
            pinIcon: getImageName('pin', place.type),
            circleIcon: getImageName('circle', place.type),
          },
          geometry: {
            type: 'Point',
            coordinates: [place.position.lng, place.position.lat],
          },
        });
      } else {
        secret = {
          type: 'Feature',
          id: place.id,
          properties: {
            name: place.name,
            type: place.type,
            icon: getImageName('secret'),
          },
          geometry: {
            type: 'Point',
            coordinates: [7.0432442, 43.6193543],
          },
        };
      }
    });

    const { map, tileServerUrl, navigation } = this.props;
    const { data, isModalVisible, userLocation, fabVisible } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          onPress={this.hideModal}
          logoEnabled={false}
          attributionEnabled={false}
          pitchEnabled={false}
          showUserLocation
          styleURL={tileServerUrl}
          compassViewMargins={{
            x: 10,
            y: StatusBar.currentHeight * 1.5 + 10,
          }}
        >
          <MapboxGL.Camera
            ref={this.camera}
            maxBounds={map.bounds}
            minZoomLevel={map.minZoom}
            maxZoomLevel={map.maxZoom}
            defaultSettings={{ centerCoordinate: map.centerCoordinate, zoomLevel: map.defaultZoom }}
          />
          <MapboxGL.Images images={markerImages} />
          <MapboxGL.ShapeSource
            id="markerShapeSource"
            shape={featureCollection}
            onPress={this.onMarkerPress}
          >
            <MapboxGL.SymbolLayer
              id="1"
              maxZoomLevel={9}
              style={{ iconImage: ['get', 'circleIcon'], iconSize: 0.5 }}
            />
            <MapboxGL.SymbolLayer
              id="2"
              minZoomLevel={9}
              style={{ iconImage: ['get', 'pinIcon'], iconSize: 1, iconAnchor: 'bottom' }}
            />
          </MapboxGL.ShapeSource>
          <MapboxGL.ShapeSource id="secretShapeSource" shape={secret} onPress={this.onMarkerPress}>
            <MapboxGL.SymbolLayer
              id="3"
              minZoomLevel={19}
              style={{ iconImage: ['get', 'icon'], iconSize: 1 }}
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
              onPress={() => navigation.openDrawer()}
              icon="menu"
              color={colors.text}
              size={24}
            />
          </View>
        ) : null}

        {fabVisible ? (
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
              onPress={this.requestUserLocation}
            />
          </View>
        ) : null}
        <ExplorerAttribution />

        <Modal
          supportedOrientations={['portrait', 'landscape']}
          isVisible={isModalVisible}
          hasBackdrop={false}
          onBackButtonPress={this.hideModal}
          coverScreen={false}
          animationOutTiming={200} // We want it to dissapear fast
          style={explorerStyles.modal}
        >
          <LocationModal data={data} hideModal={this.hideModal} />
        </Modal>
      </View>
    );
  }
}

function ExplorerAttribution() {
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
      id: PropTypes.string.isRequired,
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
    openDrawer: PropTypes.func.isRequired,
  }).isRequired,
};
