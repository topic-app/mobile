import React from 'react';
import { View, Text, Linking } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapboxGL from '@react-native-mapbox-gl/maps';

import LocationModalContents from './locationModal';
import { getImageName, markerImages } from '../utils/getAssetColor';

import { styles } from '../../../../styles/Styles';
import carteStyles from '../styles/Styles';

MapboxGL.setAccessToken('DO-NOT-REMOVE-ME');

export default class ExplorerComponentShowMap extends React.Component {
  constructor(props) {
    super(props);
    this.onIconPress = this.onIconPress.bind(this);
    this.state = {
      id: '',
      name: '',
      isModalVisible: false,
    };
  }

  async componentDidMount() {
    this.getLocationAsync();
  }

  onIconPress({ features }) {
    const feature = features[0];
    const { coordinates } = feature.geometry;
    ExplorerComponentShowMap.camera.moveTo(coordinates, 100);
    this.setState({
      id: feature.id,
      name: feature.properties.name,
      isModalVisible: true,
    });
  }

  goTo = (lng, lat, zoom, animationTime) => {
    ExplorerComponentShowMap.camera.setCamera({
      centerCoordinate: [lng, lat],
      zoomLevel: zoom,
      animationDuration: animationTime,
    });
  }

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.warn('Location Permission Denied, skipping recenter of map.');
    } else {
      let location = await Location.getCurrentPositionAsync({});
      this.goTo(location.coords.longitude, location.coords.latitude, 11, 0);
    }
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  }

  render() {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    const { places } = this.props;
    places.forEach((place) => {
      featureCollection.features.push({
        type: 'Feature',
        id: place.id,
        properties: {
          name: place.name,
          pinIcon: getImageName('pin', place.type),
          circleIcon: getImageName('circle', place.type),
        },
        geometry: {
          type: 'Point',
          coordinates: [place.position.lng, place.position.lat],
        },
      });
    });

    const { map, navigate, tileServerUrl } = this.props;
    const { id, name, isModalVisible } = this.state;

    const secret = {
      type: 'Feature',
      properties: {
        icon: getImageName('secret'),
      },
      geometry: {
        type: 'Point',
        coordinates: [7.0432442, 43.6193543],
      },
    };

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
        >
          <MapboxGL.Camera
            ref={(c) => ExplorerComponentShowMap.camera = c}
            maxBounds={map.bounds}
            minZoomLevel={map.minZoom}
            maxZoomLevel={map.maxZoom}
            defaultSettings={{ centerCoordinate: map.centerCoordinate, zoomLevel: map.defaultZoom }}
          />
          <MapboxGL.Images
            images={markerImages}
          />
          <MapboxGL.ShapeSource
            id="markerShapeSource"
            shape={featureCollection}
            onPress={this.onIconPress}
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
          <MapboxGL.ShapeSource
            id="secretShapeSource"
            shape={secret}
            onPress={() => Linking.openURL('https://www.firstuk.org/')}
          >
            <MapboxGL.SymbolLayer
              id="3"
              minZoomLevel={19}
              style={{ iconImage: ['get', 'icon'], iconSize: 1 }}
            />
          </MapboxGL.ShapeSource>
          <MapboxGL.UserLocation
            visible
            animated
          />
        </MapboxGL.MapView>
        <View style={carteStyles.attributionContainer}>
          <Text style={[carteStyles.attribution, carteStyles.atributionMutedColor]}>
            {' '}
            ©
            {' '}
          </Text>
          <Text
            onPress={() => Linking.openURL('https://openmaptiles.org/')}
            style={[styles.link, carteStyles.attribution]}
          >
            OpenMapTiles
          </Text>
          <Text style={[carteStyles.attribution, carteStyles.atributionMutedColor]}>
            {' and '}
            ©
            {' '}
          </Text>
          <Text
            onPress={() => Linking.openURL('https://www.openstreetmap.org/copyright')}
            style={[styles.link, carteStyles.attribution]}
          >
            OpenStreetMap
          </Text>
          <Text style={[carteStyles.attribution, carteStyles.atributionMutedColor]}>
            {' '}
            contributors
            {' '}
          </Text>
        </View>
        <Modal
          supportedOrientations={['portrait', 'landscape']}
          isVisible={isModalVisible}
          hasBackdrop={false}
          onBackButtonPress={this.hideModal}
          coverScreen={false}
          animationOutTiming={600}
          style={carteStyles.modal}
        >
          <LocationModalContents id={id} name={name} />
        </Modal>
      </View>
    );
  }
}

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
  navigate: PropTypes.func.isRequired,
  tileServerUrl: PropTypes.string.isRequired,
};