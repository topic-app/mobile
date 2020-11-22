import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';

import { Config } from '@constants/index';
import places from '@src/data/explorerListData.json';
import { useTheme } from '@utils/index';

import ExplorerMap from './Map';

const map = {
  minZoom: 4.25,
  maxZoom: 19,
  defaultZoom: 4.75,
  centerCoordinate: [2.4, 46.5] as [number, number],
  bounds: { ne: [-6, 51.5] as [number, number], sw: [10, 41] as [number, number] },
};

type ExplorerListProps = {
  navigation: StackNavigationProp<any, any>;
};

const ExplorerList: React.FC<ExplorerListProps> = ({ navigation }) => {
  const { dark } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <ExplorerMap
        tileServerUrl={`${Config.maps.baseUrl}styles/${dark ? 'dark' : 'light'}/style.json`}
        places={places}
        map={map}
        navigation={navigation}
      />
    </View>
  );
};

export default ExplorerList;
