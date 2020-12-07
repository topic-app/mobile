import { StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getLandingStyles(theme: Theme) {
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
      fontFamily: 'Rubik-Light',
    },
    sectionTitle: {
      fontSize: 30,
      marginBottom: 10,
    },
    sectionSubtitle: {
      fontSize: 24,
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
      paddingTop: 10,
      paddingHorizontal: 15,
      paddingBottom: 10,
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
      backgroundColor: colors.primaryBackground,
    },
    viewpager: {
      flex: 1,
    },
  });
}

export default getLandingStyles;
