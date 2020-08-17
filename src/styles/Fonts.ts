import { configureFonts } from "react-native-paper";

const fontConfig: Parameters<typeof configureFonts>[0] = {
  web: {
    regular: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "normal",
    },
    medium: {
      fontFamily:
        'Rubik-Medium, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "normal",
    },
    light: {
      fontFamily: 'Rubik-Light, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "normal",
    },
    thin: {
      fontFamily: 'Rubik-Light, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "normal",
    },
  },
  ios: {
    regular: {
      fontFamily: "System",
      fontWeight: "400" as "400",
    },
    medium: {
      fontFamily: "Rubik-Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Rubik-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "Rubik-Light",
      fontWeight: "normal",
    },
  },
  default: {
    regular: {
      fontFamily: "Roboto",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Rubik-Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Rubik-Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "Rubik-Light",
      fontWeight: "normal",
    },
  },
};

export default configureFonts(fontConfig);
