import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getGroupStyles(_theme: Theme) {
  return StyleSheet.create({
    activeCommentContainer: {
      paddingHorizontal: 15,
      paddingBottom: 0,
      paddingTop: 15,
    },
  });
}

export default getGroupStyles;
