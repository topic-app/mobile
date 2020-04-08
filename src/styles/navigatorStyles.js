import { StyleSheet } from 'react-native';

import { colors } from './Theme';

const navigatorStyles = StyleSheet.create({
  profileIconContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  drawerStyle: {
    backgroundColor: colors.background,
  },
  title: {
    marginRight: 60,
    marginTop: 5,
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
