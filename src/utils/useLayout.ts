import { useWindowDimensions, Platform } from 'react-native';

const useLayout = () => {
  const { width } = useWindowDimensions();
  if (width > 750 && Platform.OS === 'web') {
    return 'desktop';
  } else {
    return 'mobile';
  }
};

export default useLayout;
