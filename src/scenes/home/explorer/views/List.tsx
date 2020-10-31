// eslint-disable-next-line no-unused-vars
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import places from '@src/data/explorerListData.json';
import { config } from '@root/app.json';
import { useTheme } from '@utils/index';

import ExplorerMap from './Map';

const map = {
  minZoom: 4.25,
  maxZoom: 19,
  defaultZoom: 4.75,
  centerCoordinate: [2.4, 46.5],
  bounds: { ne: [-6, 51.5], sw: [10, 41] },
};

function ExplorerList({ navigation }) {
  const { dark } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <ExplorerMap
        tileServerUrl={`${config.maps.url}styles/${dark ? 'dark' : 'light'}/style.json`}
        places={places}
        map={map}
        navigation={navigation}
      />
    </View>
  );
}

export default ExplorerList;

ExplorerList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    openDrawer: PropTypes.func.isRequired,
  }).isRequired,
};
