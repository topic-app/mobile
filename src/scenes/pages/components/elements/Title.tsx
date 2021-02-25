import React from 'react';
import { View } from 'react-native';
import { Title, Subheading } from 'react-native-paper';

import { Page } from '@ts/groupPages';
import { Pages } from '@ts/types';

import type { PagesScreenNavigationProp } from '../../index';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  element: Pages.Element<'title'>;
  page: Page;
};

const Content: React.FC<PageProps> = ({ navigation, element }) => {
  return (
    <View style={{ margin: 20 }}>
      <Title
        style={{
          textAlign: element.data.textAlign || 'center',
          color: element.data.titleColor,
          fontSize: element.data.titleSize,
        }}
      >
        {element.data.title}
      </Title>
      {!!element.data.subtitle && (
        <Subheading
          style={{
            textAlign: element.data.textAlign || 'center',
            color: element.data.subtitleColor,
            fontSize: element.data.subtitleSize,
          }}
        >
          {element.data.subtitle}
        </Subheading>
      )}
    </View>
  );
};

export default Content;
