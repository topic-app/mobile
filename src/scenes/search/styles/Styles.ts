import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getSearchStyles(theme: Theme) {
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
