import { StyleSheet } from 'react-native';

import getGlobalStyles from '@styles/global';
import { Theme } from '@ts/types';

export default function getStyles(theme: Theme) {
  const globalStyles = getGlobalStyles(theme);

  return StyleSheet.create({
    ...globalStyles,
    activeCommentContainer: {
      paddingHorizontal: 15,
      paddingBottom: 0,
      paddingTop: 15,
    },
    textInput: {
      width: '100%',
      alignSelf: 'center',
      paddingBottom: 3,
    },
  });
}
