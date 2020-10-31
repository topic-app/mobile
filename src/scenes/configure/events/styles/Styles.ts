import { Theme } from '@ts/types';
import { StyleSheet } from 'react-native';

function getArticleStyles(theme: Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    listItem: { padding: 6 },
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
    addListInput: {
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
    subheaderDescriptionContainer: {
      marginHorizontal: 15,
      marginBottom: 10,
    },
    listSpacer: {
      height: 20,
    },
  });
}

export default getArticleStyles;
