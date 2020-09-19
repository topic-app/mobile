import { StyleSheet } from 'react-native';

function getGroupStyles(theme) {
  return StyleSheet.create({
    activeCommentContainer: {
      paddingHorizontal: 15,
      paddingBottom: 0,
      paddingTop: 15,
    },
  });
}

export default getGroupStyles;
