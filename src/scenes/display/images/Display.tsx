import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TranslucentStatusBar, PlatformBackButton } from '@components';
import { getImageUrl } from '@utils';
import AutoHeightImage from '@utils/autoHeightImage';

import { ImageDisplayScreenNavigationProp, ImageDisplayStackParams } from '.';

type ImageDisplayProps = {
  navigation: ImageDisplayScreenNavigationProp<'Display'>;
  route: RouteProp<ImageDisplayStackParams, 'Display'>;
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ navigation, route }) => {
  const { image } = route.params || {};

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
