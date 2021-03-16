import { StyleSheet } from 'react-native';

import getGlobalStyles from '@styles/global';
import getNavigatorStyles from '@styles/navigators';
import { Theme } from '@ts/types';

export default function getStyles(theme: Theme) {
  const globalStyles = getGlobalStyles(theme);
  const navigatorStyles = getNavigatorStyles(theme);
  return StyleSheet.create({
    ...globalStyles,
    ...navigatorStyles,
  });
}
