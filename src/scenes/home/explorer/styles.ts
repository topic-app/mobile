import { createStyleSheet } from '@styles/helpers';

export default createStyleSheet(
  ({ dark, colors }) => ({
    modal: {
      margin: 0,
    },
    modalContainer: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
      marginTop: 54,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    modalTitle: {
      // paddingHorizontal: 8,
      fontSize: 20,
      color: colors.text,
      opacity: 1,
    },
    modalSubtitle: {
      fontSize: 16,
      color: colors.subtext,
    },
    modalIcon: {
      fontSize: 30,
      marginHorizontal: 10,
    },
    modalTitleContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    modalText: {
      color: colors.text,
      fontSize: 17,
      paddingTop: 6,
    },
    pullUpTab: {
      width: 25,
      height: 5,
      backgroundColor: colors.outline,
      borderRadius: 2.5,
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
      backgroundColor: colors.highlight,
      // color applied directly to FAB
    },
    zoomButton: {
      height: 40,
      width: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.highlight,
      marginTop: 7,
    },
  }),
  { global: true },
);
