import React from 'react';
import { View } from 'react-native';
import { ThemeProvider } from 'react-native-paper';

import { Content as ContentComponent } from '@components';
import themes from '@styles/helpers/theme';
import { Page } from '@ts/groupPages';
import { Pages } from '@ts/types';

import type { PagesScreenNavigationProp } from '../../index';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  element: Pages.Element<'content'>;
  page: Page;
};

const Content: React.FC<PageProps> = ({ navigation, element }) => {
  return (
    <View style={{ margin: 20 }}>
      <ThemeProvider
        theme={{ ...themes.light, colors: { ...themes.light.colors, text: element.data.color } }}
      >
        <ContentComponent
          data={element.data.content.data}
          parser={element.data.content.parser}
          trustLinks
        />
      </ThemeProvider>
    </View>
  );
};

export default Content;
