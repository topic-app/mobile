import { StyleSheet } from 'react-native';

import { isDark, colors } from './Theme';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    margin: 10,
  },
  contentContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    // borderWidth: 0.5,
    borderColor: colors.outline,
    marginTop: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
    margin: 0,
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
    fontSize: 18,
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
    borderWidth: 1,
  },
  tagContent: {
    color: colors.placeholder,
  },
  link: {
    color: '#005ccc',
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1.5,
    marginVertical: 10,
    borderRadius: 20,
  },
});

export { styles, colors, isDark };
export default styles;
