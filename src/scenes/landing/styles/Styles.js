import { StyleSheet } from 'react-native';

function getLandingStyles(theme) {
  const { colors } = theme;
  return StyleSheet.create({
    centerContainer: {
      marginTop: 20,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerIllustrationContainer: {
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
    title: {
      fontSize: 60,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 30,
      marginBottom: 10,
    },
    headerContainer: {
      margin: 10,
      maxWidth: 600,
      width: '100%',
      alignSelf: 'center',
    },
    contentContainer: {
      padding: 20,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
    },
    searchContainer: {
      paddingHorizontal: 20,
      paddingBottom: 5,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
    },
    listContainer: {
      marginTop: 30,
    },
    chipContainer: {
      marginTop: 20,
    },
    landingPage: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    viewpager: {
      flex: 1,
    },
  });
}

export default getLandingStyles;
