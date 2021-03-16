import React from 'react';
import { View } from 'react-native';

import { Page } from '@ts/groupPages';
import { Pages } from '@ts/types';

import type { PagesScreenNavigationProp } from '../..';
import Block from '../Block';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  background: Pages.Background<'color'>;
  page: Page;
  loading?: boolean;
};

const Color: React.FC<PageProps> = ({ navigation, background, page }) => {
  return (
    <View style={{ backgroundColor: background.data.color, minHeight: background.minHeight }}>
      <Block navigation={navigation} columns={background.columns} page={page} />
    </View>
  );
};

export default Color;
