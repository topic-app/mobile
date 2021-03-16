import { StyleSheet } from 'react-native';

import getGlobalStyles from '@styles/global';
import { Theme } from '@ts/types';

export default function getStyles(theme: Theme) {
  const { colors } = theme;

  const globalStyles = getGlobalStyles(theme);

  return StyleSheet.create({
    ...globalStyles,
    title: {
      color: colors.text,
      fontSize: 25,
      fontWeight: '400',
      marginBottom: 5,
    },
    captionText: {
      color: colors.disabled,
    },
  });
}
