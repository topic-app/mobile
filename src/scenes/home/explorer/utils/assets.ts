/* eslint-disable global-require */

/*
In React Native, Strings are statically analyzed at compile-time,
so require() statements have to be simple strings, not dynamic ones
Read more here: https://dev.to/emilios1995/dynamic-imports-in-react-native-9k5
*/

const markerImages = {
  circleWhite: require('@assets/images/explorer/location-circle-white.png'),
  circleGray: require('@assets/images/explorer/location-circle-gray.png'),
  pinPurple: require('@assets/images/explorer/location-pin-purple.png'),
  pinGreen: require('@assets/images/explorer/location-pin-green.png'),

  // secret: require('@assets/images/explorer/easter-egg.png'),
};

export { markerImages };
