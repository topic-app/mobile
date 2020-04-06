import React from 'react';
import { View, Linking, StatusBar } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapboxGL from '@react-native-mapbox-gl/maps';

import LocationModalContents from './locationModal';
import { getImageName, markerImages } from '../utils/getAssetColor';

import { styles } from '../../../../styles/Styles';
import explorerStyles from '../styles/Styles';

MapboxGL.setAccessToken('DO-NOT-REMOVE-ME');

class ExplorerComponentShowMap extends React.Component {
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
    };
  }

  async componentDidMount() {
    this.getLocationAsync();
  }

  onMarkerPress({ features }) {
    const feature = features[0];
    const { coordinates } = feature.geometry;
    ExplorerComponentShowMap.camera.moveTo(coordinates, 100);
    this.setState({
      data: {
        id: feature.id,
        type: feature.properties.type,
        name: feature.properties.name,
      },
      isModalVisible: true,
    });
  }

  goTo = (lng, lat, zoom, animationTime) => {
    ExplorerComponentShowMap.camera.setCamera({
      centerCoordinate: [lng, lat],
      zoomLevel: zoom,
      animationDuration: animationTime,
    });
  };

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.warn('Location Permission Denied, skipping recenter of map.');
    } else {
      this.setState({ userLocation: true });
      const location = await Location.getCurrentPositionAsync({});
      this.goTo(location.coords.longitude, location.coords.latitude, 11, 0);
    }
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

    const { map, tileServerUrl } = this.props;
    const { data, isModalVisible, userLocation } = this.state;

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
            ref={(c) => {
              ExplorerComponentShowMap.camera = c;
            }}
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
          {userLocation ? <MapboxGL.UserLocation visible animated /> : null}
        </MapboxGL.MapView>
        <Modal
          supportedOrientations={['portrait', 'landscape']}
          isVisible={isModalVisible}
          hasBackdrop={false}
          onBackButtonPress={this.hideModal}
          coverScreen={false}
          animationOutTiming={200} // We want it to dissapear fast
          style={explorerStyles.modal}
        >
          <LocationModalContents data={data} hideModal={this.hideModal} />
        </Modal>
        <FAB
          style={explorerStyles.fab}
          icon="crosshairs-gps"
          onPress={() => console.log('Pressed')}
        />
        <ExplorerAttribution />
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

export default ExplorerComponentShowMap;

ExplorerComponentShowMap.propTypes = {
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
};
