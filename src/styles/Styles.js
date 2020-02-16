import { StyleSheet } from 'react-native';

// TODO: Charger theme à partir de préférences utilisateur
const selectedTheme = 'dark';

// Deux couleurs primaires de C-Node
const cnodePrimary = '#990092';
const cnodeSecondary = '#63005e';

const themes = {
  light: {
    primary: cnodePrimary,
    secondary: cnodeSecondary,
    background: '#ffffff',
    text: '#000000',
    highlight: '#fdfdfd',

    outline: '#e1e1e1',

    cardBackground: '#fefefe',
    tabBackground: '#f1f1f1',
    inactiveTab: '#767676',
  },
  dark: {
    primary: cnodePrimary,
    secondary: cnodeSecondary,
    background: '#202020',
    text: '#fafafa',
    highlight: '#303030',

    outline: '#434343',

    cardBackground: '#252525',
    tabBackground: '#101010',
    inactiveTab: '#767676',
  },
};

const colors = themes[selectedTheme];
const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: colors.tabBackground,
  },
  container: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderWidth: 0.8,
    borderColor: colors.outline,
    elevation: 0,
  },
  thumbnail: {
    backgroundColor: colors.highlight,
    flex: 0,
  },
  text: {
    color: colors.text,
  },
  tag: {
    backgroundColor: colors.highlight,
    color: colors.text,
    borderWidth: 1,
  },
});
const customStyles = {
  header: {
    headerStyle: {
      backgroundColor: colors.tabBackground,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
};

export { styles, colors, customStyles };
export default styles;
