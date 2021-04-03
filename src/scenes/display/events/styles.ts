import { StyleSheet } from 'react-native';

import getGlobalStyles from '@styles/global';
import { Theme } from '@ts/types';

export default function getStyles(theme: Theme) {
  const { colors } = theme;

  const globalStyles = getGlobalStyles(theme);

  return StyleSheet.create({
    ...globalStyles,
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
    username: {
      color: colors.softContrast,
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
    commentBody: {},
    disabledText: {
      color: colors.disabled,
    },
  });
}