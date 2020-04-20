import { StyleSheet } from 'react-native';

function getArticleStyles({ theme }) {
  const { colors } = theme;
  return StyleSheet.create({
    title: {
      color: colors.text,
      fontSize: 25,
      fontWeight: '400',
      marginBottom: 5,
    },
  });
}

export { getArticleStyles };
export default getArticleStyles;
