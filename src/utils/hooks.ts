import { StatusBar, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets as RNuseSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme as usePaperTheme } from 'react-native-paper';

import { Theme } from '@ts/types';

type ReplaceReturnType<T extends (...a: any) => any, NewReturn> = (
  ...a: Parameters<T>
) => NewReturn;

/**
 * Get the current app theme
 */
export const useTheme = usePaperTheme as ReplaceReturnType<typeof usePaperTheme, Theme>;

/**
 * Get current layout of device, used to show appropriate styles for the web.
 */
export const useLayout = () => {
  const { width } = useWindowDimensions();
  if (width > 750 && Platform.OS === 'web') {
    return 'desktop';
  } else {
    return 'mobile';
  }
};

/**
 * Get the safe area insets of the device.
 */
export const useSafeAreaInsets = () => {
  const insets = RNuseSafeAreaInsets();
  if (Platform.OS === 'android' && StatusBar.currentHeight !== undefined) {
    insets.top = StatusBar.currentHeight;
  }
  return insets;
};
