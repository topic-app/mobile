import React from 'react';
import { ImageBackground } from 'react-native';

import { Page } from '@ts/groupPages';
import { Pages } from '@ts/types';
import { getImageUrl } from '@utils';

import type { PagesScreenNavigationProp } from '../..';
import Block from '../Block';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  background: Pages.Background<'image'>;
  page: Page;
  loading?: boolean;
};

const Image: React.FC<PageProps> = ({ navigation, background, page }) => {
  return (
    <ImageBackground
      source={{ uri: getImageUrl({ image: background.data.image, size: 'full' }) }}
      style={{ minHeight: background.minHeight }}
    >
      <Block navigation={navigation} columns={background.columns} page={page} />
    </ImageBackground>
  );
};

export default Image;
