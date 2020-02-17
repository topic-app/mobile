// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { WebViewLeaflet } from 'react-native-webview-leaflet';

export default class CarteListScreen extends React.Component {
  static navigationOptions = {
    title: 'Carte',
  };

  render() {
    // eslint-disable-next-line
    const { navigate } = this.props.navigation;
    return (
      <WebViewLeaflet
        styles={{ height: 300, width: 200 }}
        ref={(component) => (this.webViewLeaflet = component)}
        onMessageReceived={() => {}}
        eventReceiver={this}
        mapLayers={[{
          name: 'streets', // the name of the layer, this will be seen in the layer selection control
          checked: 'true', // if the layer is selected in the layer selection control
          type: 'TileLayer', // the type of layer as shown at https://react-leaflet.js.org/docs/en/components.html#raster-layers
          baseLayer: true,
          // url of tiles
          url: 'https://92.222.77.88/maps/{z}/{x}/{y}.png', // TODO: DO NOT HARDCODE
          // attribution string to be shown for this layer
          attribution:
            '© OpenStreetMap contributors',
        }]}
        mapCenterPosition={{
          lat: 43.6044,
          lng: 7.0227,
        }}
        zoom={12}
        // The rest of your props, see the list below
      />
    );
  }
}
