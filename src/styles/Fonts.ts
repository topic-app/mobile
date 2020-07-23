import { configureFonts } from 'react-native-paper';

const fontConfig: any = {
  default: {
    regular: {
      fontFamily: 'Rubik',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Rubik-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Rubik-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Rubik-Thin',
      fontWeight: 'normal',
    },
  },
};

fontConfig.ios = fontConfig.default;
fontConfig.android = fontConfig.default;

export default configureFonts(fontConfig);
