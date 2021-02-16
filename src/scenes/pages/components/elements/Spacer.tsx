import React from 'react';
import { View } from 'react-native';

import { Page } from '@ts/groupPages';
import { Pages } from '@ts/types';

import type { PagesScreenNavigationProp } from '../../index';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  element: Pages.Element<'spacer'>;
  page: Page;
};

const Content: React.FC<PageProps> = ({ navigation, element }) => {
  return <View style={{ height: element.data.height }} />;
};

export default Content;
