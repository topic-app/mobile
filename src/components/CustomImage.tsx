import React from 'react';
import { View, Image as RNImage } from 'react-native';
import { useTheme } from 'react-native-paper';

import { Image as ImageType } from '@ts/types';
import { getImageUrl } from '@utils/index';

import getStyles from '../styles/Styles';

type CustomImageProps = {
  image?: ImageType;
  imageSize: 'small' | 'medium' | 'large';
  height: number;
  width: number;
};

const CustomImage: React.FC<CustomImageProps> = ({ image, imageSize, height, width }) => {
  const styles = getStyles(useTheme());
  if (image?.image) {
    return (
      <RNImage
        source={{ uri: getImageUrl({ image, size: imageSize }) }}
        style={[styles.thumbnail, { width, height }]}
      />
    );
  } else {
    return <View style={[styles.thumbnail, { width, height }]} />;
  }
};

export default CustomImage;