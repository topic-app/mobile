import { StyleSheet } from 'react-native';

function getAuthStyles(theme) {
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
    textInput: {
      width: '100%',
      alignSelf: 'center',
      paddingBottom: 3,
    },
    textInputContainer: {
      alignSelf: 'stretch',
    },
    changeButtonContainer: {
      marginBottom: 20,
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
    descriptionPartContainer: {
      marginVertical: 10,
    },
    radio: {
      color: colors.primary,
    },
  });
}

export default getAuthStyles;
