import React from 'react';
import { View, Image as RNImage } from 'react-native';

import { Image as ImageType } from '@ts/types';
import { useTheme, getImageUrl } from '@utils/index';

import getStyles from '../styles/Styles';

type CustomImageProps = {
  image?: ImageType;
  imageSize: 'small' | 'medium' | 'large' | 'extralarge' | 'full';
  height: number;
  width: number;
  style?: object;
};

const CustomImage: React.FC<CustomImageProps> = ({ image, imageSize, height, width, style }) => {
  const styles = getStyles(useTheme());
  return image?.image ? (
    <RNImage
      source={{ uri: getImageUrl({ image, size: imageSize }) }}
      style={[styles.thumbnail, { width, height }, style]}
    />
  ) : (
    <View style={{ width, height, flex: 0 }} />
  );
};

export default React.memo(CustomImage);
