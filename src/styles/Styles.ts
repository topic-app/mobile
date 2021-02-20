import { Platform, StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

function getStyles(theme: Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      margin: 10,
    },
    contentContainer: {
      marginVertical: 10,
      marginHorizontal: 20,
    },
    cardTitle: {},
    card: {
      backgroundColor: colors.surface,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
      // borderWidth: 0.5,
      borderColor: colors.outline,
      marginTop: 5,
      marginBottom: 5,
      marginHorizontal: 10,
      overflow: 'hidden',
      margin: 0,
    },
    topic: {
      color: colors.drawerContent,
      fontFamily: 'Rubik-Light',
      fontSize: 30,
    },
    thumbnail: {
      backgroundColor: colors.image,
      flex: 0,
    },
    image: {
      backgroundColor: colors.image,
    },
    text: {
      color: colors.text,
    },
    primaryText: {
      color: colors.primary,
    },
    title: {
      color: colors.text,
      fontSize: 30,
      lineHeight: 35,
      fontWeight: '400',
    },
    subtitle: {
      color: colors.subtext,
      fontSize: 15,
      fontWeight: '100',
    },
    tag: {
      backgroundColor: 'transparent',
      borderWidth: 1,
    },
    tagContent: {
      color: colors.placeholder,
    },
    link: {
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    divider: {
      height: 1.5,
      marginVertical: 10,
      borderRadius: 20,
    },
    bottomRightFab: {
      position: 'absolute',
      backgroundColor: colors.primary,
      right: 15,
      bottom: 15,
    },
    avatar: {
      elevation: 1,
    },
    centerIllustrationContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerImageContainer: {
      flex: 1,
      alignItems: Platform.OS === 'web' ? undefined : 'center',
      justifyContent: 'center',
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalCard: {
      borderRadius: 0,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      maxHeight: '90%',
    },
    centeredPage: { maxWidth: 800, alignSelf: 'center', flex: 1 },
  });
}

export default getStyles;
