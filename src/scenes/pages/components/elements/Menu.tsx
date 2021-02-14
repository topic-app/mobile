import React from 'react';
import { View, Appearance, FlatList } from 'react-native';
import { Button, List, Provider, Text, Menu as MenuComponent } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

  return (
    <View style={{ flexDirection: 'row' }}>
      {element.data.elements.map((e) => {
        if (e.type === 'menu') {
          return (
            <View style={{ marginHorizontal: 10 }}>
              <Button
                theme={e.radius ? { roundness: e.radius } : undefined}
                mode={e.mode || 'text'}
                icon={e.icon}
                uppercase={false}
                color={e.color || element.data.color}
                dark={e.dark}
                style={{ justifyContent: 'center' }}
                contentStyle={{ height: element.data.height }}
                onPress={() => {}}
              >
                {e.text}
              </Button>
            </View>
          ); // TODO, show menu <View style={{ marginHorizontal: 10 }}></View>;
        } else {
          return (
            <View style={{ marginHorizontal: 10 }}>
              <Button
                theme={e.radius ? { roundness: e.radius } : undefined}
                mode={e.mode || 'text'}
                icon={e.icon}
                uppercase={false}
                color={e.color || element.data.color}
                dark={e.dark}
                style={{ justifyContent: 'center' }}
                contentStyle={{ height: element.data.height }}
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
