import { configureFonts } from 'react-native-paper';

export default configureFonts({
  web: {
    regular: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Rubik, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Rubik-Light, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Rubik-Light, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: 'normal',
    },
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Rubik',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Rubik-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Rubik-Light',
      fontWeight: 'normal',
    },
  },
  default: {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Rubik',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Rubik-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Rubik-Light',
      fontWeight: 'normal',
    },
  },
});
