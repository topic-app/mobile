import React from 'react';
import { View, Appearance, FlatList } from 'react-native';
import { Button, List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { Content as ContentComponent, CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Account, Preferences, State, Pages } from '@ts/types';
import { useTheme } from '@utils/index';

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

  return (
    <View style={{ flexDirection: 'row' }}>
      {element.data.elements.map((e) => (
        <View style={{ marginHorizontal: 10 }}>
          <Button
            mode={e.mode || 'text'}
            uppercase={false}
            color={element.data.color}
            style={{ height: element.data.height, justifyContent: 'center' }}
          >
            {e.text}
          </Button>
        </View>
      ))}
    </View>
  );
};

export default Menu;
