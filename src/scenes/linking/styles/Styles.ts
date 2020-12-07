import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getAuthStyles(theme: Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    centerContainer: {
      marginTop: 20,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      alignSelf: 'center',
      flexDirection: 'row',
    },
    title: {
      fontSize: 30,
      marginBottom: 10,
    },
    formContainer: {
      padding: 20,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
    },
  });
}

export default getAuthStyles;
