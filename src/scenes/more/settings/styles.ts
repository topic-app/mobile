import { StyleSheet } from 'react-native';

import getGlobalStyles from '@styles/global';
import { Theme } from '@ts/types';

export default function getStyles(theme: Theme) {
  const globalStyles = getGlobalStyles(theme);
  return StyleSheet.create({
    ...globalStyles,
    listItem: { padding: 6 },
  });
}
