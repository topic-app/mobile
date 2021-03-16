import { StyleSheet } from 'react-native';

import getGlobalStyles from '@styles/global';
import { Theme } from '@ts/types';

export default function getStyles(theme: Theme) {
  const globalStyles = getGlobalStyles(theme);

  return StyleSheet.create({
    ...globalStyles,
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
    textInput: {
      width: '100%',
      alignSelf: 'center',
      paddingBottom: 3,
    },
  });
}
