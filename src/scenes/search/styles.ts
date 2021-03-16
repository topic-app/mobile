import { StyleSheet } from 'react-native';

import getGlobalStyles from '@styles/global';
import { Theme } from '@ts/types';

export default function getStyles(theme: Theme) {
  const { colors } = theme;

  const globalStyles = getGlobalStyles(theme);

  return StyleSheet.create({
    ...globalStyles,
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
