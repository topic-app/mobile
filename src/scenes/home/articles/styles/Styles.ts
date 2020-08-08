import { StyleSheet } from 'react-native';
import { Theme } from '@ts/types';

function getArticleStyles(theme: Theme) {
  const { colors } = theme;
  return StyleSheet.create({
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

export { getArticleStyles };
export default getArticleStyles;
