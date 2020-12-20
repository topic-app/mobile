/* eslint-disable global-require */

/*
In React Native, Strings are statically analyzed at compile-time,
so require() statements have to be simple strings, not dynamic ones
Read more here: https://dev.to/emilios1995/dynamic-imports-in-react-native-9k5
*/

const markerImages = {
  circleLight: require('@assets/images/explorer/location-circle-white.png'),
  circleDark: require('@assets/images/explorer/location-circle-gray.png'),
  pinPurpleLight: require('@assets/images/explorer/location-pin-purple-light.png'),
  pinPurpleLightWithEvent: require('@assets/images/explorer/location-pin-purple-light-with-event.png'),
  pinPurpleDark: require('@assets/images/explorer/location-pin-purple-dark.png'),
  pinPurpleDarkWithEvent: require('@assets/images/explorer/location-pin-purple-dark-with-event.png'),
  pinGreenLight: require('@assets/images/explorer/location-pin-green-light.png'),
  pinGreenDark: require('@assets/images/explorer/location-pin-green-dark.png'),
  pinRedLight: require('@assets/images/explorer/location-pin-red-light.png'),
  pinRedDark: require('@assets/images/explorer/location-pin-red-dark.png'),
  // secret: require('@assets/images/explorer/easter-egg.png'),
};

export { markerImages };
