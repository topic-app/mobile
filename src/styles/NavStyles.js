import { StyleSheet, StatusBar } from 'react-native';

function getNavigatorStyles(theme) {
  const { colors } = theme;
  return StyleSheet.create({
    header: {
      backgroundColor: colors.appBar,
      elevation: 1,
      zIndex: 1,
    },
    barStyle: {
      backgroundColor: colors.tabBackground,
      shadowColor: '#000',
      elevation: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
    },

    // Drawer styles
    title: {
      marginTop: 5,
      color: colors.drawerContent,
    },
    profileIconContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    profileBackground: {
      backgroundColor: colors.drawerBackground,
      paddingTop: StatusBar.currentHeight,
    },
    drawerStyle: {
      backgroundColor: colors.surface,
    },
    avatar: {
      elevation: 3,
    },
  });
}

export default getNavigatorStyles;
