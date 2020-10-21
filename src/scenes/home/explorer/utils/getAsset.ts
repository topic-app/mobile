/* eslint-disable global-require */

import { ExplorerLocation } from '@root/src/ts/api';

/*
In React Native, Strings are statically analyzed at compile-time,
so require() statements have to be simple strings, not dynamic ones
Read more here: https://dev.to/emilios1995/dynamic-imports-in-react-native-9k5
*/

const markerImages = {
  circlePurple: require('@assets/images/explorer/location-circle-purple.png'),
  circleRed: require('@assets/images/explorer/location-circle-red.png'),
  circleGreen: require('@assets/images/explorer/location-circle-green.png'),
  circleGold: require('@assets/images/explorer/location-circle-gold.png'),
  pinPurple: require('@assets/images/explorer/location-pin-purple.png'),
  pinRed: require('@assets/images/explorer/location-pin-red.png'),
  pinGreen: require('@assets/images/explorer/location-pin-green.png'),
  pinGold: require('@assets/images/explorer/location-pin-gold.png'),
  secret: require('@assets/images/explorer/easter-egg.png'),
};

const markerColors = {
  purple: '#4c3e8e',
  green: '#0e6300',
  red: '#d00000',
  gold: '#e59500',
  secret: '#b90007',
};

function getAssetName(placeType: ExplorerLocation.LocationTypes, markerType: 'circle' | 'pin') {
  let color: string;
  switch (placeType) {
    case 'collection':
      return 'circleRed';
    case 'secret':
      return 'secret';
    case 'event':
      color = 'Green';
      break;
    case 'place':
      color = 'Red';
      break;
    case 'school':
      color = 'Purple';
      break;
    default:
      color = 'Red';
  }
  return markerType === 'circle' ? `circle${color}` : `pin${color}`;
}

export { markerImages, markerColors, getAssetName };
