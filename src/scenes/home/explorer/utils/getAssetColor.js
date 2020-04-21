/* eslint-disable global-require */

/* 
In React Native, Strings are statically analyzed at compile-time,
so require() statements have to be simple strings, not dyamic ones
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

const getImageName = (markerType, placeType) => {
  let color = 'Red';
  if (markerType === 'secret') {
    return 'secret';
  }
  if (placeType === 'school') {
    color = 'Purple';
  } else if (placeType === 'museum') {
    color = 'Red';
  } else if (placeType === 'event') {
    color = 'Green';
  }
  if (markerType === 'circle') {
    return `circle${color}`;
  }
  return `pin${color}`;
};

export { markerImages, markerColors, getImageName };
export default markerImages;
