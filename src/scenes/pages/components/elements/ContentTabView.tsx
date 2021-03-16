import React from 'react';
import { View, ScrollView } from 'react-native';
import { ThemeProvider } from 'react-native-paper';

import { ContentTabView as ContentTabViewComponent } from '@components';
import themes from '@styles/helpers/theme';
import { Page } from '@ts/groupPages';
import { Pages } from '@ts/types';

import type { PagesScreenNavigationProp } from '../../index';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  element: Pages.Element<'contentTabView'>;
  page: Page;
};

const ContentTabView: React.FC<PageProps> = ({ navigation, element }) => {
  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider theme={themes[element.data.theme] || themes.light}>
        <ScrollView
          style={{ flex: 1 }} // TODO: Figure out nested scroll
        >
          <ContentTabViewComponent
            searchParams={element.data.params}
            types={element.data.types}
            maxCards={element.data.max}
            showHeader={!!element.data.title}
            header={element.data.title}
          />
        </ScrollView>
      </ThemeProvider>
    </View>
  );
};

export default ContentTabView;
