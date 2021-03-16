import React from 'react';
import { View, Image as ImageComponent } from 'react-native';

import { Page } from '@ts/groupPages';
import { Pages } from '@ts/types';
import { getImageUrl } from '@utils';

import type { PagesScreenNavigationProp } from '../../index';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  element: Pages.Element<'image'>;
  page: Page;
};

const Image: React.FC<PageProps> = ({ navigation, element }) => {
  return (
    <View style={{ alignSelf: 'stretch', margin: 20 }}>
      <ImageComponent
        source={{ uri: getImageUrl({ image: element.data.image, size: 'full' }) }}
        resizeMode={element.data.mode}
        style={{ height: element.data.height }}
      />
    </View>
  );
};

export default Image;
