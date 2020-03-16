// eslint-disable-next-line no-unused-vars
import React from 'react';
import { View, Image } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import ExplorerComponentDisplayIcons from '../components/displayIcons';
import { selectedTheme } from '../../../../styles/Styles';
import places from '../data/testExplorerLocations.json';

// To use MapboxGL, you have to set an access token
// even if you never actually use it ¯\_(ツ)_/¯
MapboxGL.setAccessToken('DO-NOT-REMOVE-ME');

const tileServerUrl = 'http://92.222.77.88/maps';
const map = {
  minZoom: 4.25,
  maxZoom: 19,
  defaultZoom: 4.75,
  centerCoordinate: [2.4, 46.5],
  bounds: { ne: [-6, 51.5], sw: [10, 41] },
};

export default class CarteListScreen extends React.Component {
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
          attributionEnabled
          attributionPosition={{bottom: 8, right: 8}}
          pitchEnabled={false}
          showUserLocation
          styleURL={`${tileServerUrl}/styles/${selectedTheme}/style.json`}
        >
          <ExplorerComponentDisplayIcons places={places} map={map} />
        </MapboxGL.MapView>
      </View>
    );
  }
}
