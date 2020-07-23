import { StyleSheet } from 'react-native';

function getSearchStyles(theme) {
  const { colors } = theme;
  return StyleSheet.create({
    searchbar: {
      margin: 12,
    },
    queryContainer: {
      backgroundColor: colors.surface,
      elevation: 3,
    },
    container: {
      paddingHorizontal: 12,
    },
    suggestionContainer: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      flexDirection: 'row',
    },
    containerBottom: {
      paddingBottom: 12,
    },
  });
}

export default getSearchStyles;
