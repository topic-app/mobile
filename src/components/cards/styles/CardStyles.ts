import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getCardStyles(theme: Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    cardDescription: {
      fontSize: 15,
    },
  });
}

export default getCardStyles;
