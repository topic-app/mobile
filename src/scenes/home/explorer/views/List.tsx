import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { Config } from '@constants/index';
import { LocationList, MapLocation, State } from '@ts/types';
import { useTheme } from '@utils/index';

import { HomeTwoScreenNavigationProp } from '../../HomeTwo.ios';
import ExplorerMap from './Map';

type ExplorerListProps = {
  navigation: HomeTwoScreenNavigationProp<'Explorer'>;
  location: LocationList;
};

const ExplorerList: React.FC<ExplorerListProps> = ({ navigation, location }) => {
  const mapConfig = {
    minZoom: 4.25,
    maxZoom: 19,
    defaultZoom: 4.75,
    centerCoordinate: [2.4, 46.5] as [number, number],
    bounds: { ne: [-6, 51.5] as [number, number], sw: [10, 41] as [number, number] },
  };

  const { dark } = useTheme();

  const permanentPlaces: MapLocation.Point<'school'>[] = [];

  if (location.selected) {
    const { schools, schoolData } = location;

    const locations = schoolData.filter((sch) => schools.includes(sch._id));

    // If the user has a selected location, then use that as default location
    if (locations.length > 0 && locations[0].address) {
      mapConfig.centerCoordinate = locations[0].address.geo.coordinates;
      mapConfig.defaultZoom = 14;
    }

    // Add all the schools to permanentPoints, meaning they will always be
    // visible on the map
    locations.forEach((sch) => {
      if (sch.address) {
        permanentPlaces.push({
          id: sch._id,
          type: 'Feature',
          dataType: 'school',
          geometry: {
            type: 'Point',
            coordinates: sch.address.geo.coordinates,
          },
          properties: {
            _id: sch._id,
            name: sch.name,
            associatedEvents: sch.cache?.events ?? 0,
          },
        });
      }
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <ExplorerMap
        tileServerUrl={`${Config.maps.baseUrl}styles/${dark ? 'dark' : 'light'}/style.json`}
        mapConfig={mapConfig}
        navigation={navigation}
        permanentPlaces={permanentPlaces}
      />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { location } = state;

  return { location };
};

export default connect(mapStateToProps)(ExplorerList);
