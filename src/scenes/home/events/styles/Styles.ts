import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getEventStyles({ colors }: Theme) {
  return StyleSheet.create({
    captionText: {
      color: colors.disabled,
    },
  });
}

export default getEventStyles;
