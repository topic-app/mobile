import { DefaultTheme, DarkTheme } from 'react-native-paper';

const selectedTheme = 'light';

const common = {
  roundness: 5,
  statusBarTranslucent: true,
  colors: {
    statusBar: 'transparent',
    primary: '#592989',
    primaryLighter: '#6a31a3',
    primaryDarker: '#4e2478',
    secondary: '#892989',
  },
};

const lightBase = {
  ...DefaultTheme,
  ...common,
  colors: {
    ...DefaultTheme.colors,
    ...common.colors,
    appBar: '#ffffff',
    tabBackground: '#ffffff',
    drawerBackground: '#ffffff',
    drawerContent: '#000000',
    background: '#ffffff',
    softContrast: '#999999',
    highlight: '#fdfdfd',
    outline: '#e1e1e1',
    surface: '#fcfcfc',
    image: '#dddddd',
    subtext: '#999999',
    muted: '#444444',
    valid: '#3dc33c',
    text: '#111111',
  },
};

const darkBase = {
  ...DarkTheme,
  ...common,
  colors: {
    ...DarkTheme.colors,
    ...common.colors,
    appBar: '#242529',
    tabBackground: '#242529',
    drawerBackground: '#242529',
    drawerContent: '#ffffff',
    softContrast: '#434343',
    highlight: '#303030',
    outline: '#343434',
    background: '#151618',
    surface: '#202125',
    image: '#444444',
    subtext: '#666666',
    muted: '#999999',
    valid: '#28a127',
  },
};

const themes = {
  purple: {
    ...lightBase,
    colors: {
      ...lightBase.colors,
      appBar: common.colors.primary,
      // Optional: defines text color on drawer background, default is
      drawerBackground: common.colors.primaryLighter,
      drawerContent: darkBase.colors.text,
    },
  },
  light: lightBase,
  dark: darkBase,
};

const theme = themes[selectedTheme];
const { colors } = theme;
const isDark = theme.dark === true;

export { theme, colors, isDark };
export default theme;
