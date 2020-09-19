import { useWindowDimensions, Platform } from 'react-native';

const getLayout = () => {
  const width = useWindowDimensions().width;
  if (width > 750 && Platform.OS === 'web') {
    return 'desktop';
  } else {
    return 'mobile';
  }
};

export default getLayout;
