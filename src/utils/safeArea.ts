import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets as RNuseSafeAreaInsets } from 'react-native-safe-area-context';

// eslint-disable-next-line import/prefer-default-export
export const useSafeAreaInsets = () => {
  const insets = RNuseSafeAreaInsets();
  if (Platform.OS === 'android' && StatusBar.currentHeight !== undefined) {
    insets.top = StatusBar.currentHeight;
  }
  return insets;
};
