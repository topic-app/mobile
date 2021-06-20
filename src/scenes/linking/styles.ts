import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  () => ({
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
  }),
  { global: true },
);
