import { StyleSheet } from 'react-native';

import { colors } from './Theme';

const navigatorStyles = StyleSheet.create({
  profileIconContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 3, 
    alignItems: 'center',
  },
  drawerStyle: {
    backgroundColor: colors.background,
  },
  title: {
    paddingHorizontal: 10,
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerStyle: {
    elevation: 4,
  },
  barStyle: {
    backgroundColor: colors.tabBackground,
    elevation: 4,
  },
});

export { navigatorStyles, colors };
