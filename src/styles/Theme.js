import { DefaultTheme, DarkTheme } from 'react-native-paper';

const selectedTheme = 'dark';

const common = {
  roundness: 2,
  colors: {
    primary: '#4c3e8e',
    secondary: '#9284d4',
  },
};

const themes = {
  light: {
    ...DefaultTheme,
    ...common,
    colors: {
      ...DefaultTheme.colors,
      ...common.colors,
      softContrast: '#999999',
      highlight: '#fdfdfd',
      outline: '#e1e1e1',
      tabBackground: '#f1f1f1',
      background: '#ffffff',
      surface: '#f4f4f4',
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
      softContrast: '#434343',
      highlight: '#303030',
      outline: '#434343',
      tabBackground: '#080808',
      background: '#0f0f0f',
      surface: '#222222',
      image: '#444444',
      subtext: '#666666',
      muted: '#999999',
      valid: '#28a127',
    },
  },
};

const theme = themes[selectedTheme];
const { colors } = theme;

export { theme, colors, selectedTheme };
export default theme;
