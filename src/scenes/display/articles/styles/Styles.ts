import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getArticleStyles(theme: Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    image: {
      height: 250,
    },
    placeholder: {
      color: colors.disabled,
    },
    activeCommentContainer: {
      paddingHorizontal: 15,
      paddingBottom: 0,
      paddingTop: 15,
    },
    divider: {
      marginVertical: 5,
    },
    commentInput: {
      color: colors.text,
      fontSize: 16,
      padding: 0,
      paddingBottom: 10,
      paddingLeft: 2,
    },
    username: {
      color: colors.softContrast,
    },
    commentBody: {},
    disabledText: {
      color: colors.disabled,
    },
  });
}

export default getArticleStyles;
