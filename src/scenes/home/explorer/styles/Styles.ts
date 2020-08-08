import { StyleSheet } from 'react-native';

function getExplorerStyles(theme) {
  const { colors, dark } = theme;
  return StyleSheet.create({
    modal: {
      margin: 0,
    },
    modalContainer: {
      flex: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 5,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    modalTitle: {
      paddingHorizontal: 8,
      fontWeight: 'bold',
      fontSize: 20,
      textAlignVertical: 'center',
      flex: 1,
    },
    modalIcon: {
      textAlignVertical: 'center',
      fontSize: 22,
    },
    modalTitleContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    modalText: {
      color: colors.text,
      fontSize: 17,
      paddingHorizontal: 2,
    },
    pullUpTab: {
      width: 70,
      height: 5,
      backgroundColor: colors.outline,
      borderRadius: 20,
    },
    pullUpTabContainer: {
      width: '100%',
      alignItems: 'center',
      paddingBottom: 15,
    },
    attribution: {
      fontSize: 10,
    },
    atributionMutedColor: {
      color: colors.muted,
    },
    attributionContainer: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      alignSelf: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap',
      position: 'absolute',
      backgroundColor: dark ? '#44444466' : '#ffffff66',
      bottom: 0,
      right: 0,
    },
    fab: {
      marginBottom: 25,
      marginRight: 15,
      backgroundColor: dark ? '#c5c5c5' : '#ffffff',
      // color applied directly to FAB
    },
  });
}

export default getExplorerStyles;
