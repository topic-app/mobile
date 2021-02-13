import React from 'react';
import { View, Appearance, FlatList } from 'react-native';
import { List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
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
};

const Block: React.FC<PageProps> = ({ navigation, columns }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getSettingsStyles(theme);

  const Elements = {
    menu: Menu,
    content: Content,
    contentTabView: ContentTabView,
    image: Image,
  };

  return (
    <View style={styles.container}>
      {columns.map((c) => (
        <FlatList
          nestedScrollEnabled
          data={c.elements}
          renderItem={({ item }) => {
            const E = Elements[item.type];
            return (
              <View
                style={[
                  styles.container,
                  {
                    alignItems: c.align,
                    flex: 1,
                    justifyContent: c.alignVertical, // TODO: doesnt work
                  },
                ]}
              >
                <E navigation={navigation} element={item} />
              </View>
            );
          }}
        />
      ))}
    </View>
  );
};

export default Block;
