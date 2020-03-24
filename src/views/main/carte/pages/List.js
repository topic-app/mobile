// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { selectedTheme } from '../../../../styles/Styles';
import places from '../data/testExplorerLocations.json';
import ExplorerComponentShowMap from '../components/mapMarkers';

// To use MapboxGL, you have to set an access token
// even if you never actually use it ¯\_(ツ)_/¯

const tileServerUrl = 'https://maps.topicapp.fr';
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
    headerShown: false,
  };

  render() {
    const { navigation } = this.props;
    const { navigate } = navigation;

    navigate('CarteDisplayScreen', { id: '1' });

    return (
      <View style={{ flex: 1 }}>
        <ExplorerComponentShowMap
          tileServerUrl={`${tileServerUrl}/styles/${selectedTheme}/style.json`}
          places={places}
          map={map}
          navigate={(id) => navigate('CarteArticle', id)}
        />
      </View>
    );
  }
}

CarteListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
