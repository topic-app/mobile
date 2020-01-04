import { DrawerLayoutAndroidComponent } from 'react-native'

// Todo: Define colors for each theme (dark, light, etc)
// This should just return an object with theme -> category -> color

// TODO: Chercher cette option dans les paramètres utilisateurs
const selectedTheme = 'light';

// Deux couleurs primaires de C-Node
const cnodePrimary = '#990092';
const cnodeSecondary = '#63005e';

const themes = {
  light: {
    primary: cnodePrimary,
    secondary: cnodeSecondary,
    background: '#ffffff',
    text: '#000000',
    highlight: '#e9e9e9',

    cardBackground: '#f8f8f8',
    tabBackground: '#e2e2e2',
    inactiveTab: '#767676'
  },
  dark: {
    primary: cnodePrimary,
    secondary: cnodeSecondary,
    background: '#222222',
    text: '#ffffff',
    highlight: '#444444',

    cardBackground: '#333333',
    tabBackground: '#191919',
    inactiveTab: '#767676'
  }
}

module.exports = themes[selectedTheme];
