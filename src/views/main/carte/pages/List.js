// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import places from '../data/testExplorerLocations.json';
import { selectedTheme } from '../../../../styles/Styles';

// To use MapboxGL, you have to set an access token
// even if you never actually use it ¯\_(ツ)_/¯
MapboxGL.setAccessToken('DO-NOT-REMOVE-ME');
// MapboxGL.setTelemetryEnabled(false);

const tileServerUrl = 'http://92.222.77.88/maps';
const civ = [7.04583333, 43.6213889];
const zoom = {
  country: 5,
  region: 8,
  bigCity: 10,
  city: 12,
  quarter: 14,
  zone: 16,
  precise: 18,
  house: 20,
};

export default class CarteListScreen extends React.Component {
  constructor(props) {
    super(props);
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.warn('Location Permission Denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(JSON.stringify(location));
  };

  static navigationOptions = {
    title: 'Carte',
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1 }}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          logoEnabled={false}
          attributionEnabled={false}
          showUserLocation
          styleURL={`${tileServerUrl}/styles/${selectedTheme}/style.json`}
        >
          <MapboxGL.Camera
            ref={(c) => this._camera = c}
            defaultSettings={{
              centerCoordinate: civ,
              zoomLevel: zoom.city,
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

