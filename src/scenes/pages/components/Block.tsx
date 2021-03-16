import React from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';

import { Page, ElementNames } from '@ts/groupPages';
import { Pages } from '@ts/types';

import type { PagesScreenNavigationProp } from '../index';
import Content from './elements/Content';
import ContentTabView from './elements/ContentTabView';
import Image from './elements/Image';
import Menu from './elements/Menu';
import Spacer from './elements/Spacer';
import Title from './elements/Title';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  columns: Pages.Background<Pages.BackgroundNames>['columns'];
  page: Page;
};

const Block: React.FC<PageProps> = ({ navigation, columns, page }) => {
  const dimensions = useWindowDimensions();

  const Elements = {
    menu: Menu,
    content: Content,
    contentTabView: ContentTabView,
    image: Image,
    title: Title,
    spacer: Spacer,
  } as Record<
    ElementNames,
    React.FC<{
      navigation: PagesScreenNavigationProp<any>;
      element: Pages.Element<ElementNames>;
      page: Page;
    }>
  >;

  const MIN_COLUMN_WIDTH = 400; // Will wrap columns if average column width is < 400

  return (
    <View
      style={[
        { flexDirection: dimensions.width / columns.length < MIN_COLUMN_WIDTH ? 'column' : 'row' },
      ]}
    >
      {columns.map((c) => (
        <View
          style={{
            flex: c.size || 1,
            alignItems: c.align,
            justifyContent: c.alignVertical,
          }}
        >
          <FlatList
            listKey={c.id}
            nestedScrollEnabled
            data={c.elements}
            renderItem={({ item }) => {
              const E = Elements[item.type];
              if (
                (item.maxWidth && item.maxWidth < dimensions.width) ||
                (item.minWidth && item.minWidth >= dimensions.width)
              ) {
                return null;
              }
              return (
                <View
                  style={[
                    {
                      alignSelf: item.align,
                      marginLeft: item.marginLeft,
                      marginRight: item.marginRight,
                      marginTop: item.marginTop,
                      marginBottom: item.marginBottom,
                      marginHorizontal: item.marginHorizontal,
                      marginVertical: item.marginVertical,
                      margin: item.margin,
                    },
                  ]}
                >
                  <E navigation={navigation} element={item} page={page} />
                </View>
              );
            }}
          />
        </View>
      ))}
    </View>
  );
};

export default Block;
