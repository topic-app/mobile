import { StyleSheet } from 'react-native';

import getGlobalStyles from '@styles/global';
import { Theme } from '@ts/types';

export default function getStyles(theme: Theme) {
  const globalStyles = getGlobalStyles(theme);
  return StyleSheet.create({
    ...globalStyles,
    listItem: { padding: 6 },
    searchContainer: {
      paddingHorizontal: 20,
      paddingBottom: 5,
      paddingTop: 10,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
    },
    buttonContainer: {
      marginHorizontal: 10,
      marginVertical: 10,
    },
  });
}
