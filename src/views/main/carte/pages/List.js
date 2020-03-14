// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import places from '../data/testExplorerLocations.json';

MapboxGL.setAccessToken('blabla');

const civ = [7.04583333, 43.6213889];
const zoom = {
  country: 5,
  region: 8,
  bigCity: 10,
  city: 12,
  quarter: 14,
  zone: 16,
  precise: 18,
  house: 20
}

export default class CarteListScreen extends React.Component {
  static navigationOptions = {
    title: 'Carte',
  };

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          showUserLocation
          styleURL="http://92.222.77.88/maps/styles/dark-custom/style.json"
        >
          <MapboxGL.Camera
            ref={(c) => this._camera = c}
            defaultSettings={{
              centerCoordinate: civ,
              zoomLevel: zoom.city
            }}
          />
          <MapboxGL.UserLocation
            visible
            animated
          />
        </MapboxGL.MapView>
      </View>
    );
  }
}
