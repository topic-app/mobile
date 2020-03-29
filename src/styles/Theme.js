import { DefaultTheme, DarkTheme } from 'react-native-paper';

const selectedTheme = 'light';

const common = {
  roundness: 7,
  statusBarTranslucent: true,
  colors: {
    statusBar: 'transparent',
    primary: '#592989',
    secondary: '#892989',
  },
};

const themes = {
  purple: {
    ...DefaultTheme,
    ...common,
    colors: {
      ...DefaultTheme.colors,
      ...common.colors,
      appBar: common.colors.primary,
      background: '#ffffff',
      softContrast: '#999999',
      highlight: '#fdfdfd',
      outline: '#e1e1e1',
      tabBackground: '#f1f1f1',
      surface: '#f5f5f5',
      image: '#dddddd',
      subtext: '#999999',
      muted: '#444444',
      valid: '#3dc33c',
    },
  },
  light: {
    ...DefaultTheme,
    ...common,
    colors: {
      ...DefaultTheme.colors,
      ...common.colors,
      appBar: '#f1f1f1',
      tabBackground: '#f1f1f1',
      background: '#ffffff',
      softContrast: '#999999',
      highlight: '#fdfdfd',
      outline: '#e1e1e1',
      surface: '#f5f5f5',
      image: '#dddddd',
      subtext: '#999999',
      muted: '#444444',
      valid: '#3dc33c',
    },
  },
  dark: {
    ...DarkTheme,
    ...common,
    colors: {
      ...DarkTheme.colors,
      ...common.colors,
      appBar: '#242529',
      tabBackground: '#242529',
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
  },
};

const theme = themes[selectedTheme];
const { colors } = theme;
const isDark = theme.dark === true;

export { theme, colors, isDark };
export default theme;
