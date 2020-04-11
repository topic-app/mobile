// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import places from '../../../../data/explorerListData.json';
import ExplorerMap from './Map';

import { isDark } from '../../../../styles/Styles';

const tileServerUrl = 'https://maps.topicapp.fr';

const map = {
  minZoom: 4.25,
  maxZoom: 19,
  defaultZoom: 4.75,
  centerCoordinate: [2.4, 46.5],
  bounds: { ne: [-6, 51.5], sw: [10, 41] },
};

function ExplorerList({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <ExplorerMap
        tileServerUrl={`${tileServerUrl}/styles/${isDark ? 'dark' : 'light'}/style.json`}
        places={places}
        map={map}
        navigate={(id) => navigation.navigate('ExplorerArticle', id)}
      />
    </View>
  );
}

export default ExplorerList;

ExplorerList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
