import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  ({ colors }) => ({
    centerContainer: {
      marginTop: 20,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      // alignSelf: 'center',
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
    centerAvatarContainer: {
      marginVertical: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarContainer: {
      margin: 10,
      height: 110,
      width: 110,
      borderRadius: 55,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
  { global: true },
);
