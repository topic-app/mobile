import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  ({ colors }) => ({
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
      marginBottom: 30,
    },
    buttonContainer: {
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
    listItem: { padding: 6 },
    image: {
      height: 250,
    },
    placeholder: {
      color: colors.disabled,
    },
    activeCommentContainer: {
      paddingHorizontal: 15,
      paddingBottom: 15,
      paddingTop: 15,
    },
    divider: {
      marginVertical: 5,
    },
    addListInput: {
      color: colors.text,
      fontSize: 16,
      padding: 0,
      paddingBottom: 10,
      paddingLeft: 2,
    },
    username: {
      color: colors.softContrast,
    },
    commentBody: {},
    disabledText: {
      color: colors.disabled,
    },
    subheaderDescriptionContainer: {
      marginHorizontal: 15,
      marginBottom: 10,
    },
    listSpacer: {
      height: 20,
    },
  }),
  { global: true },
);
