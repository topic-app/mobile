import { StyleSheet } from 'react-native';
import colors from '../utils/Colors';

// Si je pouvais juste ajouter colors au Stylesheet... :(
module.exports = StyleSheet.create({
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
