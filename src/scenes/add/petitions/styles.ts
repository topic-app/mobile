import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

export default function getStyles(theme: Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    centerContainer: {
      marginTop: 20,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInput: {
      width: '100%',
      alignSelf: 'center',
      paddingBottom: 3,
    },
    textInputContainer: {
      alignSelf: 'stretch',
    },
    buttonContainer: {
      alignSelf: 'center',
      flexDirection: 'row',
    },
    listContainer: {
      padding: 10,
    },
    descriptionContainer: {
      marginLeft: 20,
      marginRight: 25,
      marginTop: 10,
      marginBottom: 20,
    },
    cardContainer: {
      marginBottom: 20,
    },
    warningContainer: {
      marginTop: 20,
      marginHorizontal: 20,
    },
    descriptionPartContainer: {
      marginVertical: 10,
    },
    title: {
      fontSize: 30,
      marginBottom: 10,
    },
    stepIndicatorContainer: {
      margin: 10,
      maxWidth: 600,
      width: '100%',
      alignSelf: 'center',
    },
    formContainer: {
      padding: 20,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
    },
    radio: {
      color: colors.primary,
    },
  });
}
