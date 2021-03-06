import React from 'react';
import { View, Image as RNImage, ImageProps, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';

import getStyles from '@styles/global';
import { Image as ImageType } from '@ts/types';
import { getImageUrl } from '@utils';

type CustomImageProps = {
  image?: ImageType;
  imageSize: 'small' | 'medium' | 'large' | 'extralarge' | 'full';
} & Omit<ImageProps, 'source'>;

const CustomImage: React.FC<CustomImageProps> = ({
  image,
  imageSize,
  height,
  width,
  style,
  ...props
}) => {
  const styles = getStyles(useTheme());

  if (image?.image) {
    return (
      <View style={Platform.OS === 'web' ? { width, height } : undefined}>
        <RNImage
          accessibilityLabel="Image"
          source={{ uri: getImageUrl({ image, size: imageSize }) }}
          style={[styles.thumbnail, Platform.OS === 'web' ? { flex: 1 } : { width, height }, style]}
          {...props}
        />
      </View>
    );
  } else {
    return <View style={{ width, height, flex: 0 }} />;
  }
};

export default React.memo(CustomImage);
