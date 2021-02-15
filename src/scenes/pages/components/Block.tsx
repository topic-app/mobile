import React from 'react';
import { View, Appearance, FlatList, useWindowDimensions } from 'react-native';
import { List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Page, ElementNames } from '@ts/groupPages';
import { Account, Preferences, State, Pages } from '@ts/types';
import { useTheme } from '@utils/index';

import type { PagesScreenNavigationProp } from '../index';
import getSettingsStyles from '../styles/Styles';
import Content from './elements/Content';
import ContentTabView from './elements/ContentTabView';
import Image from './elements/Image';
import Menu from './elements/Menu';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  columns: Pages.Background<Pages.BackgroundNames>['columns'];
  page: Page;
};

const Block: React.FC<PageProps> = ({ navigation, columns, page }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getSettingsStyles(theme);

  const dimensions = useWindowDimensions();

  const Elements = {
    menu: Menu,
    content: Content,
    contentTabView: ContentTabView,
    image: Image,
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
              return (
                <View
                  style={[
                    {
                      alignSelf: item.align,
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
