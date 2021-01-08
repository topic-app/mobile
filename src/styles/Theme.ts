import { Platform } from 'react-native';
import { DefaultTheme, DarkTheme } from 'react-native-paper';

import fonts from './Fonts';
import { paletteLight, paletteDark } from './Palette';

type BaseThemeType = typeof DefaultTheme & {
  statusBarStyle: 'light-content' | 'dark-content';
  colors: {
    statusBar: string;
    primary: string;
    primaryLighter: string;
    primaryDarker: string;
    primaryBackground: string;
    secondary: string;
    solid: typeof paletteLight;
    appBar: string;
    appBarText: string;
    appBarButton: string;
    bottomBar: string;
    bottomBarActive: string;
    bottomBarInactive: string;
    tabBackground: string;
    drawerBackground: string;
    drawerContent: string;
    background: string;
    softContrast: string;
    highlight: string;
    outline: string;
    image: string;
    subtext: string;
    icon: string;
    muted: string;
    valid: string;
    invalid: string;
    warning: string;
    anchor: string;
    activeDrawerItem: string;
  };
};

type ThemeName = 'light' | 'purple' | 'ultraviolet' | 'dark' | 'amoled';

type ThemeType = BaseThemeType & {
  name: string;
  value: ThemeName;
  egg?: boolean;
};

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

const lightBase: BaseThemeType = {
  ...DefaultTheme,
  ...common,
  statusBarStyle: 'dark-content', // The text color of the status bar
  colors: {
    ...DefaultTheme.colors,
    ...common.colors,
    solid: paletteLight,
    appBar: '#ffffff',
    appBarText: '#111111',
    appBarButton: common.colors.primary,
    bottomBar: '#ffffff',
    bottomBarActive: common.colors.primary,
    bottomBarInactive: '#999999',
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

const darkBase: BaseThemeType = {
  ...DarkTheme,
  // Note: 'dark: true' is included in ...DarkTheme,
  ...common,
  statusBarStyle: 'light-content',
  colors: {
    ...DarkTheme.colors,
    ...common.colors,
    solid: paletteDark,
    primary: common.colors.primaryLighter,
    bottomBar: '#242529',
    bottomBarActive: common.colors.primaryLighter,
    bottomBarInactive: '#999999',
    appBar: '#242529',
    appBarText: '#ffffff',
    appBarButton: common.colors.primaryLighter,
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

const themes: {
  [key in ThemeName]: ThemeType;
} = {
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
      appBarText: '#ffffff',
      appBarButton: '#ffffff',
      activeDrawerItem: common.colors.primaryLighter,
      bottomBar: common.colors.primary,
      bottomBarActive: '#ffffff',
      bottomBarInactive: '#999999',
      drawerBackground: common.colors.primary,
      // Optional: drawerContent defines text color that rests on the drawer background
      drawerContent: darkBase.colors.text,
    },
  },
  ultraviolet: {
    name: 'Ultraviolet',
    value: 'ultraviolet',
    egg: true,
    ...darkBase,
    statusBarStyle: 'light-content',
    colors: {
      ...darkBase.colors,
      primary: '#ffffff',
      appBar: common.colors.primaryDarker,
      appBarText: '#ffffff',
      appBarButton: '#ffffff',
      bottomBar: common.colors.primaryDarker,
      bottomBarActive: '#ffffff',
      bottomBarInactive: '#999999',
      subtext: '#BBBBBB',
      softContrast: '#999999',
      drawerBackground: common.colors.primaryDarker,
      // Optional: drawerContent defines text color that rests on the drawer background
      drawerContent: darkBase.colors.text,
      background: common.colors.primaryDarker,
      surface: common.colors.primary,
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
      bottomBar: '#000000',
      tabBackground: '#000000',
      drawerBackground: '#000000',
      background: '#000000',
      surface: '#000000',
    },
  },
};

// Eslint needs a bit of help :)
// eslint-disable-next-line no-undef
export { ThemeType as Theme };

export default themes;
