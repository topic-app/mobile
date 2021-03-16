import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { ProgressBar, ActivityIndicator as PaperActivityIndicator } from 'react-native-paper';

import { Page } from '@ts/groupPages';
import { Pages } from '@ts/types';

import type { PagesScreenNavigationProp } from '../..';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  background: Pages.Background<'loader'>;
  page: Page;
  loading?: boolean;
};

const Loader: React.FC<PageProps> = ({ navigation, background, page, loading }) => {
  if (!loading) return null;

  return (
    <View style={{ backgroundColor: background.data.backgroundColor }}>
      {background.data.type === 'bar' && (
        <ProgressBar indeterminate color={background.data.color} />
      )}
      {background.data.type === 'spinner' && (
        <View style={{ margin: 10 }}>
          <ActivityIndicator size="large" color={background.data.color} />
        </View>
      )}
      {background.data.type === 'paper' && (
        <View style={{ margin: 10 }}>
          <PaperActivityIndicator size="large" color={background.data.color} />
        </View>
      )}
    </View>
  );
};

export default Loader;
