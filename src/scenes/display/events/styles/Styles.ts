import { StyleSheet } from 'react-native';

import { Theme } from '@root/src/ts/types';

function getEventStyles(theme: Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    date: {
      fontSize: 15,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 19,
      marginBottom: 5,
      marginLeft: 20,
    },
    description: {
      marginTop: 20,
      marginHorizontal: 20,
    },
    time: {
      fontWeight: 'bold',
      marginLeft: 10,
    },
    subject: {
      marginLeft: 20,
    },
    image: {
      minHeight: 250,
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

export default getEventStyles;
