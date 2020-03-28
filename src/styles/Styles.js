import { StyleSheet } from 'react-native';

import { selectedTheme, colors } from './Theme';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
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
    elevation: 2,
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

export { styles, colors, selectedTheme };
export default styles;
