import React from 'react';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapboxGL from '@react-native-mapbox-gl/maps';
import LocationModalContents from './locationModal';

import pin from '../assets/location-pin.png';
import { styles } from '../../../../styles/Styles';
import carteStyles from '../styles/Styles';

MapboxGL.setAccessToken('DO-NOT-REMOVE-ME');

export default class ExplorerComponentShowMap extends React.Component {
  constructor(props) {
    super(props);
    this.onIconPress = this.onIconPress.bind(this);
    this.state = {
      id: '',
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
          icon: place.imgUrl,
        },
        geometry: {
          type: 'Point',
          coordinates: [place.position.lng, place.position.lat],
        },
      });
    });

    const { map, navigate, tileServerUrl } = this.props;
    const { id, isModalVisible } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          onPress={this.hideModal}
          logoEnabled={false}
          attributionEnabled
          attributionPosition={{bottom: 8, right: 8}}
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
          <MapboxGL.ShapeSource
            id="markerShapeSource"
            shape={featureCollection}
            hitbox={{ width: 20, height: 20 }}
            onPress={this.onIconPress}
          >
            <MapboxGL.SymbolLayer id="1" style={{ iconImage: pin, iconSize: 1.1, iconAnchor: 'bottom' }} />
          </MapboxGL.ShapeSource>
          <MapboxGL.UserLocation
            visible
            animated
          />
        </MapboxGL.MapView>
        <Modal
          supportedOrientations={['portrait', 'landscape']}
          isVisible={isModalVisible}
          hasBackdrop={false}
          onBackButtonPress={this.hideModal}
          coverScreen={false}
          animationOutTiming={400}
          style={carteStyles.modal}
        >
          <LocationModalContents id={id} navigate={navigate} />
        </Modal>
      </SafeAreaView>
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
      summary: PropTypes.string.isRequired,
      imgUrl: PropTypes.string.isRequired,
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
