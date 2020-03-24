const markerImages = {
  circlePurple: require('../assets/location-circle-purple.png'),
  circleRed: require('../assets/location-circle-red.png'),
  circleGreen: require('../assets/location-circle-green.png'),
  circleGold: require('../assets/location-circle-gold.png'),
  pinPurple: require('../assets/location-pin-purple.png'),
  pinRed: require('../assets/location-pin-red.png'),
  pinGreen: require('../assets/location-pin-green.png'),
  pinGold: require('../assets/location-pin-gold.png'),
  secret: require('../assets/easter-egg.png'),
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
