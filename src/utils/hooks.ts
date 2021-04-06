import { useWindowDimensions, Platform } from 'react-native';

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
