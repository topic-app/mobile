import { StyleSheet } from 'react-native';

import getGlobalStyles from '@styles/global';
import { Theme } from '@ts/types';

export default function getStyles(theme: Theme) {
  const { colors } = theme;

  const globalStyles = getGlobalStyles(theme);

  return StyleSheet.create({
    ...globalStyles,
    profileItem: {
      margin: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    keyText: { color: colors.disabled },
    valueText: { fontSize: 24, fontFamily: 'Rubik-Medium' },
    inputContainer: {
      paddingHorizontal: 15,
      paddingBottom: 0,
      paddingTop: 15,
    },
    borderlessInput: {
      color: colors.text,
      fontSize: 16,
      padding: 0,
      paddingBottom: 10,
      paddingLeft: 2,
    },
  });
}
