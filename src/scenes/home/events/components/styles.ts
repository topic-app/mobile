import { StyleSheet } from 'react-native';

import getGlobalStyles from '@styles/global';
import { Theme } from '@ts/types';

function getEventStyles(theme: Theme) {
  const { colors } = theme;

  const globalStyles = getGlobalStyles(theme);

  return StyleSheet.create({
    ...globalStyles,
    captionText: {
      color: colors.disabled,
    },
  });
}

export default getEventStyles;
