import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { Page } from '@ts/groupPages';
import { Pages } from '@ts/types';

import type { PagesScreenNavigationProp } from '../../index';
import Block from '../Block';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  background: Pages.Background<'gradient'>;
  page: Page;
  loading?: boolean;
};

const Gradient: React.FC<PageProps> = ({ navigation, background, page }) => {
  return (
    <View>
      <LinearGradient
        colors={[background.data.start, background.data.end]}
        style={{
          minHeight: background.minHeight,
        }}
        useAngle
        angle={background.data.angle || 0}
        angleCenter={{ x: 0.5, y: 0.5 }}
      >
        <Block navigation={navigation} columns={background.columns} page={page} />
      </LinearGradient>
    </View>
  );
};

export default Gradient;
