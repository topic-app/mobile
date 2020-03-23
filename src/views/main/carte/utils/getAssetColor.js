const markerImages = {
  circlePurple: require('../assets/location-circle-purple.png'),
  circleRed: require('../assets/location-circle-red.png'),
  circleGreen: require('../assets/location-circle-green.png'),
  circleGold: require('../assets/location-circle-gold.png'),
  pinPurple: require('../assets/location-pin-purple.png'),
  pinRed: require('../assets/location-pin-red.png'),
  pinGreen: require('../assets/location-pin-green.png'),
  pinGold: require('../assets/location-pin-gold.png'),
};

const markerColors = {
  purple: '#4c3e8e',
  green: '#0e6300',
  red: '#d00000',
  gold: '#e59500',
};

const getImageName = (markerType, placeType) => {
  let color = 'red';
  if (placeType === 'school') {
    color = 'Purple';
  } else if (placeType === 'museum') {
    color = 'Red';
  } else if (placeType === 'event') {
    color = 'Green';
  } else if (placeType === 'secret') {
    color = 'Gold';
  }
  if (markerType === 'circle') {
    return `circle${color}`;
  }
  return `pin${color}`;
};

export { markerImages, markerColors, getImageName };
export default markerImages;
