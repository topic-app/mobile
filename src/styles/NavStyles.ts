import { StyleSheet, StatusBar } from 'react-native';

import { Theme } from '@ts/types';

function getNavigatorStyles(theme: Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    header: {
      backgroundColor: colors.appBar,
      elevation: 2,
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
    topic: {
      color: colors.drawerContent,
      fontFamily: 'Rubik-Light',
      fontSize: 30,
    },
    title: {
      color: colors.drawerContent,
      fontSize: 16,
      marginTop: 14,
      flex: 1,
    },
    subtitle: {
      marginTop: -10,
      fontSize: 14,
      flex: 1,
    },
    profileIconContainer: {
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: 10,
    },
    profileBackground: {
      backgroundColor: colors.drawerBackground,
      paddingTop: StatusBar.currentHeight,
      minHeight: 130,
      marginBottom: -4,
    },
    drawerStyle: {
      backgroundColor: colors.surface,
    },
    avatar: {
      elevation: 3,
      marginRight: 10,
    },
  });
}

export default getNavigatorStyles;
