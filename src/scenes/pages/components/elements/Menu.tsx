import React from 'react';
import { View, Appearance, FlatList } from 'react-native';
import { Button, List, Provider, Text, Menu as MenuComponent } from 'react-native-paper';
import { connect } from 'react-redux';

import { Content as ContentComponent, CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Account, Preferences, State, Pages } from '@ts/types';
import { handleUrl, useTheme } from '@utils/index';

import type { PagesScreenNavigationProp } from '../../index';
import getLocalStyles from '../../styles/Styles';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  element: Pages.Element<'menu'>;
};

const Menu: React.FC<PageProps> = ({ navigation, element }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getLocalStyles(theme);

  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);

  console.log(menuVisible);

  return (
    <View style={{ flexDirection: 'row' }}>
      {element.data.elements.map((e) => {
        if (e.type === 'menu') {
          return null; // TODO, show menu <View style={{ marginHorizontal: 10 }}></View>;
        } else {
          return (
            <View style={{ marginHorizontal: 10 }}>
              <Button
                mode={e.mode || 'text'}
                uppercase={false}
                color={element.data.color}
                style={{ height: element.data.height, justifyContent: 'center' }}
                onPress={() => {
                  if (e.type === 'external') {
                    handleUrl(e.url, { trusted: true });
                  } else if (e.type === 'internal') {
                    console.warn('Not implemented');
                  }
                }}
              >
                {e.text}
              </Button>
            </View>
          );
        }
      })}
    </View>
  );
};

export default Menu;
