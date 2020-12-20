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
  pinPurpleStarLight: require('@assets/images/explorer/location-pin-purple-star-light.png'),
  pinPurpleStarLightWithEvent: require('@assets/images/explorer/location-pin-purple-star-with-event-light.png'),
  pinPurpleStarDark: require('@assets/images/explorer/location-pin-purple-star-dark.png'),
  pinPurpleStarDarkWithEvent: require('@assets/images/explorer/location-pin-purple-star-with-event-dark.png'),
  pinGreenLight: require('@assets/images/explorer/location-pin-green-light.png'),
  pinGreenDark: require('@assets/images/explorer/location-pin-green-dark.png'),
  pinRedLight: require('@assets/images/explorer/location-pin-red-light.png'),
  pinRedDark: require('@assets/images/explorer/location-pin-red-dark.png'),
  // secret: require('@assets/images/explorer/easter-egg.png'),
};

export { markerImages };
