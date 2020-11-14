import { Platform, StyleSheet } from 'react-native';

import { Theme } from '@ts/types';

// const eventPaddingLeft = 4
const leftMargin = 50 - 1;

export default function getCalendarStyles(theme: Theme, calendarHeight: number) {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentStyle: {
      backgroundColor: colors.background,
      height: calendarHeight + 10,
    },
    header: {
      paddingHorizontal: 30,
      height: 50,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.outline,
      backgroundColor: colors.surface,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
    },
    headerTextContainer: {
      justifyContent: 'center',
    },
    headerText: {
      fontSize: 16,
    },
    arrow: {
      fontSize: 15,
      color: colors.disabled,
    },
    arrowButton: {
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    event: {
      position: 'absolute',
      backgroundColor: theme.dark ? '#35476B' : '#F0F4FF',
      opacity: 0.8,
      borderColor: theme.dark ? '#2B3A58' : '#DDE5FD',
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 4,
      minHeight: 25,
      flex: 1,
      paddingTop: 5,
      paddingBottom: 0,
      flexDirection: 'column',
      alignItems: 'flex-start',
      overflow: 'hidden',
    },
    eventTitle: {
      color: colors.text,
      fontWeight: '600',
      minHeight: 15,
    },
    eventSummary: {
      color: colors.muted,
      fontSize: 12,
      flexWrap: 'wrap',
    },
    eventTimes: {
      marginTop: 3,
      fontSize: 11,
      fontWeight: 'bold',
      color: colors.text,
      flexWrap: 'wrap',
    },
    line: {
      height: 1,
      position: 'absolute',
      left: leftMargin,
      backgroundColor: colors.outline,
    },
    lineNow: {
      height: 1,
      position: 'absolute',
      left: leftMargin,
      backgroundColor: 'red',
    },
    timeLabel: {
      position: 'absolute',
      left: 15,
      color: 'rgb(170,170,170)',
      fontSize: 10,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
      fontWeight: '500',
    },
  });
}
