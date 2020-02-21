// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import {
  WebViewLeaflet, AnimationType, INFINITE_ANIMATION_ITERATIONS, MapShapeType,
} from 'react-native-webview-leaflet';
import { Card } from 'react-native-paper';
import { Text } from 'react-native';

import MapView, { UrlTile } from 'react-native-maps';
import places from '../data/testExplorerLocations.json';

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
      <MapView
        style={{ height: '100%' }}
        showsUserLocation
        region={{
          latitude: 43.6213888889,
          longitude: 7.04583333333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/*
        <UrlTile
          urlTemplate={'http://92.222.77.88/styles/klokantech-basic/{z}/{x}/{y}.png'}
          maximumZ={19}
          flipY={false}
        />
      */}
      </MapView>
      /*
      <WebViewLeaflet
        styles={{ height: 300, width: 200 }}
        ref={(component) => { this.webViewLeaflet = component; }}
        onMessageReceived={() => {}}
        eventReceiver={this}
        mapLayers={[{
          name: 'streets', // the name of the layer, this will be seen in the layer selection control
          checked: 'true', // if the layer is selected in the layer selection control
          type: 'TileLayer', // the type of layer as shown at https://react-leaflet.js.org/docs/en/components.html#raster-layers
          baseLayer: true,
          // url of tiles
          url: 'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png', // TODO: DO NOT HARDCODE
          // attribution string to be shown for this layer
          attribution:
            '© OpenStreetMap contributors',
        }]}
        mapCenterPosition={{
          lat: 43.6044,
          lng: 7.0227,
        }}
        zoom={12}
        mapMarkers={[
          {
            id: '1',
            position: { lat: 43.62, lng: 7.04 },
            icon: '<div style="background-color: white; padding-top: 2px; padding-bottom: 3px; padding-left: 10px; padding-right: 10px; border-radius: 20px; box-shadow: 0 2px 8px 0 grey;"><span style="font-size: 18px;">CIV</span></div>',
          },
          {
            id: '2',
            position: { lat: 43.65, lng: 7.09 },
            icon: '<div style="background-color: white; padding-top: 2px; padding-bottom: 2px; padding-left: 10px; padding-right: 10px; border-radius: 20px; box-shadow: 0 2px 8px 0 grey;"><span style="font-size: 18px;">Évènement</span></div>',
          },
          {
            id: '3',
            position: { lat: 43.66, lng: 7.085 },
            icon: '<div style="background-color: white; padding-top: 2px; padding-bottom: 2px; padding-left: 10px; padding-right: 10px; border-radius: 20px; box-shadow: 0 2px 8px 0 grey;"><span style="font-size: 18px;">Bonjour</span></div>',
          },
        ]}
        mapShapes={[
          {
            shapeType: MapShapeType.CIRCLE,
            color: '#123123',
            id: '1',
            center: { lat: 34.225727, lng: -77.94471 },
            radius: 2000,
          },
        ]}
      /> */
    );
  }
}
