import { StyleSheet } from 'react-native';

import { isDark, colors } from './Theme';

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
    elevation: 2, // Note: Android only looks at elevation for shadows
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
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

export { styles, colors, isDark };
export default styles;
