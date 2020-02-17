import { StyleSheet } from 'react-native';
import { DefaultTheme, DarkTheme } from 'react-native-paper';

// TODO: Charger theme à partir de préférences utilisateur
const selectedTheme = 'light';

// Deux couleurs primaires de C-Node
const cnodePrimary = '#990092';
const cnodeSecondary = '#63005e';

const themes = {
  light: {
    ...DefaultTheme.colors,
    highlight: '#fdfdfd',
    outline: '#e1e1e1',
    tabBackground: '#f1f1f1',
  },
  dark: {
    ...DarkTheme.colors,
    highlight: '#303030',
    outline: '#434343',
    tabBackground: '#101010',
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
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  card: {
    backgroundColor: colors.surface,
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
