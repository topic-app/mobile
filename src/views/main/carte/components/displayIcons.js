import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapboxGL from '@react-native-mapbox-gl/maps';

import pin from '../assets/location-pin.png';

export default class ExplorerComponentDisplayIcons extends React.Component {
  constructor(props) {
    super(props);

    this.onIconPress = this.onIconPress.bind(this);
    this.getLocationAsync();
  }

  onIconPress({features, coordinates, point}) {
    console.log('Marker pressed!', features, coordinates, point);
    ExplorerComponentDisplayIcons.camera.moveTo([coordinates.longitude, coordinates.latitude], 100);
  }

  goTo = (lng, lat, zoom, animationTime) => {
    ExplorerComponentDisplayIcons.camera.setCamera({
      centerCoordinate: [lng, lat],
      zoomLevel: zoom,
      animationDuration: animationTime,
    });
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.warn('Location Permission Denied, skipping recenter of map.');
    } else {
      let location = await Location.getCurrentPositionAsync({});
      this.goTo(location.coords.longitude, location.coords.latitude, 11, 0);
    }
  };

  render() {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    this.props.places.forEach((place) => {
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

    return (
      <View>
        <MapboxGL.Camera
          ref={(c) => ExplorerComponentDisplayIcons.camera = c}
          maxBounds={this.props.map.bounds}
          minZoomLevel={this.props.map.minZoom}
          maxZoomLevel={this.props.map.maxZoom}
          defaultSettings={{ centerCoordinate: this.props.map.centerCoordinate, zoomLevel: this.props.map.defaultZoom }}
        />
        <MapboxGL.UserLocation
          visible
          animated
        />
        <MapboxGL.ShapeSource
          id="markerShapeSource"
          shape={featureCollection}
          hitbox={{ width: 20, height: 20 }}
          onPress={this.onIconPress}
        >
          <MapboxGL.SymbolLayer id="1" style={{ iconImage: pin, iconSize: 1.1 }} />
        </MapboxGL.ShapeSource>
      </View>
    );
  }
}

ExplorerComponentDisplayIcons.propTypes = {
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
};
