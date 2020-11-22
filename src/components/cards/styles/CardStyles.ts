import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getCardStyles(_theme: Theme) {
  return StyleSheet.create({
    cardDescription: {
      fontSize: 15,
    },
  });
}

export default getCardStyles;
