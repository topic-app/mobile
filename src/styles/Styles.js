import { StyleSheet } from 'react-native';

import Theme, { selectedTheme } from './Theme';

const { colors } = Theme;

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
  link: {
    color: '#005ccc',
    textDecorationLine: 'underline',
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
