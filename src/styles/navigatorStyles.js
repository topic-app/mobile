import { StyleSheet } from 'react-native';

import { colors } from './Theme';

const navigatorStyles = StyleSheet.create({
  profileIconContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  drawerStyle: {
    backgroundColor: colors.background,
  },
  title: {
    paddingHorizontal: 15,
    color: colors.text,
  },
  header: {
    backgroundColor: colors.appBar,
    elevation: 1,
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
});

export { navigatorStyles, colors };
