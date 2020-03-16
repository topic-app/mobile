import { StyleSheet } from 'react-native';
import { DefaultTheme, DarkTheme } from 'react-native-paper';

// TODO: Charger theme à partir de préférences utilisateur
const selectedTheme = 'dark';

// Deux couleurs primaires de C-Node
// const cnodePrimary = '#990092';
// const cnodeSecondary = '#63005e';

const themes = {
  light: {
    ...DefaultTheme.colors,
    highlight: '#fdfdfd',
    outline: '#e1e1e1',
    tabBackground: '#f1f1f1',
    background: '#ffffff',
    surface: '#f4f4f4',
    image: '#dddddd',
    subtext: '#999999',
  },
  dark: {
    ...DarkTheme.colors,
    highlight: '#303030',
    outline: '#434343',
    tabBackground: '#080808',
    surface: '#222222',
    image: '#444444',
    subtext: '#666666',
  },
};

const colors = themes[selectedTheme];
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  barStyle: {
    backgroundColor: colors.tabBackground,
  },
  container: {
    marginTop: 10,
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
  },
  contentContainer: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: selectedTheme === 'dark' ? 0.8 : 0.0,
    borderColor: colors.outline,
    elevation: 0,
  },
  thumbnail: {
    backgroundColor: colors.image,
    flex: 0,
  },
  image: {
    backgroundColor: colors.image,
  },
  text: {
    color: colors.text,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '400',
    marginBottom: 5,
  },
  title: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '400',
  },
  subtitle: {
    color: colors.subtext,
    fontSize: 15,
    fontWeight: '100',
  },
  tag: {
    backgroundColor: 'transparent',
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

export {
  styles,
  colors,
  customStyles,
  selectedTheme,
};
export default styles;
