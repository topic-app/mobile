import { StyleSheet } from 'react-native';
import colors from '../utils/Colors';

// Si je pouvais juste ajouter colors au Stylesheet... :(
module.exports = StyleSheet.create({
  barStyle: {
    backgroundColor: colors.tabBackground
  },
  pageActus: {
    backgroundColor: colors.background,
  },
  container: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '400',
    marginBottom: 5
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderWidth: 0.7,
    borderColor: colors.highlight,
    elevation: 0,
  },
  thumbnail: {
    backgroundColor: colors.highlight,
    flex: 0
  },
  text: {
    color: colors.text
  },
  tag: {
    backgroundColor: colors.highlight,
    color: colors.text,
    borderWidth: 1.5
  }
});
