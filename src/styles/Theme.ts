import { DefaultTheme, DarkTheme } from 'react-native-paper';
import { Platform } from 'react-native';
import { solidLight, solidDark } from './SolidColors';
import fonts from './Fonts';

const common = {
  fonts,
  roundness: Platform.OS === 'ios' ? 15 : 5,
  colors: {
    statusBar: 'transparent',
    primary: '#592989',
    primaryLighter: '#6a31a3',
    primaryDarker: '#4e2478',
    primaryBackground: '#592989',
    secondary: '#892989',
  },
};

const lightBase = {
  ...DefaultTheme,
  ...common,
  statusBarStyle: 'dark-content', // The text color of the status bar
  colors: {
    ...DefaultTheme.colors,
    ...common.colors,
    solid: solidLight,
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
    icon: '#777777',
    muted: '#444444',
    valid: '#1e981d',
    invalid: '#b71d39',
    warning: '#ed8600',
    text: '#111111',
    anchor: '#3caaff',
    activeDrawerItem: '#dddddd',
  },
};

const darkBase = {
  ...DarkTheme,
  // Note: 'dark: true' is included in ...DarkTheme,
  ...common,
  statusBarStyle: 'light-content',
  colors: {
    ...DarkTheme.colors,
    ...common.colors,
    solid: solidDark,
    primary: common.colors.primaryLighter,
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
    icon: '#888888',
    muted: '#999999',
    valid: '#217c20',
    error: '#841616',
    invalid: '#8f4e5a',
    warning: '#a65e00',
    anchor: '#0084ff',
    activeDrawerItem: '#222222',
  },
};

const themes = {
  light: {
    name: 'Clair',
    value: 'light',
    ...lightBase,
  },
  purple: {
    name: 'Violet',
    value: 'purple',
    ...lightBase,
    statusBarStyle: 'light-content',
    colors: {
      ...lightBase.colors,
      appBar: common.colors.primary,
      drawerBackground: common.colors.primaryLighter,
      // Optional: drawerContent defines text color that rests on the drawer background
      drawerContent: darkBase.colors.text,
    },
  },
  dark: {
    name: 'Sombre',
    value: 'dark',
    ...darkBase,
  },
  amoled: {
    name: 'Amoled',
    value: 'amoled',
    ...darkBase,
    colors: {
      ...darkBase.colors,
      appBar: '#000000',
      tabBackground: '#000000',
      drawerBackground: '#000000',
      background: '#000000',
      surface: '#000000',
    },
  },
};

type ValueOf<T> = T[keyof T];
// Theme is union type of every theme in the `themes` object, equivalent of
// type Theme = typeof themes.light | typeof themes.purple | ...
export type Theme = ValueOf<typeof themes>;

export default themes;
