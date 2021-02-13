import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';

import { TranslucentStatusBar, PlatformBackButton, SafeAreaView } from '@components/index';
import getStyles from '@styles/Styles';
import AutoHeightImage from '@utils/autoHeightImage';
import { useTheme, getImageUrl } from '@utils/index';

import { ImageDisplayScreenNavigationProp, ImageDisplayStackParams } from '../index';

type ImageDisplayProps = {
  navigation: ImageDisplayScreenNavigationProp<'Display'>;
  route: RouteProp<ImageDisplayStackParams, 'Display'>;
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ navigation, route }) => {
  const { image } = route.params || {};
  const theme = useTheme();
  const styles = getStyles(theme);

  const dimensions = useWindowDimensions();

  return (
    <View
      style={{
        backgroundColor: '#000000',
        height: dimensions.height,
        flex: 1,
        flexGrow: 1,
        alignContent: 'center',
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <PlatformBackButton onPress={navigation.goBack} />
            <AutoHeightImage
              source={{ uri: getImageUrl({ image, size: 'full' }) || '' }}
              width={dimensions.width}
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ImageDisplay;
