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
    highlight: '#fdfdfd',

    text: '#000000',
    activeText: '#fdfdfd',
    inactiveText: '#222222',

    outline: '#e1e1e1',
    highlightOutline: '#333333',

    cardBackground: '#fefefe',
    tabBackground: '#f1f1f1',
    inactiveTab: '#767676',
  },
  dark: {
    primary: cnodePrimary,
    secondary: cnodeSecondary,
    background: '#222222',
    highlight: '#313131',

    text: '#fafafa',
    activeText: '#fdfdfd',
    inactiveText: '#CCCCCC',

    outline: '#434343',
    highlightOutline: '#cccccc',

    cardBackground: '#2a2a2a',
    tabBackground: '#191919',
    inactiveTab: '#767676',
  },
};

module.exports = themes[selectedTheme];