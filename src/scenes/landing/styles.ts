import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  ({ colors }) => ({
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
    sectionTitle: {
      fontSize: 30,
    },
    sectionSubtitle: {
      fontSize: 24,
    },
    // Welcome page
    title: {
      fontSize: 50,
      fontFamily: 'Rubik-Light',
    },
    subtitle: {
      fontSize: 40,
      fontFamily: 'Rubik-Light',
    },
    welcomeContainer: {
      height: '100%',
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
    },
    headerContainer: {
      marginTop: 25,
      alignItems: 'center',
    },
    bottomContainer: {
      flex: 1,
      alignItems: 'center',
    },
    illustrationText: {
      paddingTop: 15,
      paddingBottom: 15,
      paddingHorizontal: 40,
      textAlign: 'center',
    },
    illustrationContainer: {
      position: 'absolute',
      top: 0,
      height: '70%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewPage: {
      alignItems: 'center',
      alignSelf: 'flex-end',
      paddingBottom: 100,
    },
    dot: {
      height: 4.5,
      width: 4.5,
      borderRadius: 2.25,
      margin: 2,
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
    locationHeaderContainer: {
      margin: 10,
      paddingBottom: 40,
      maxWidth: 600,
      width: '100%',
      alignSelf: 'center',
    },
  }),
  { global: true },
);
