import React from 'react';
import { View, Appearance, FlatList } from 'react-native';
import { List, Text, ThemeProvider } from 'react-native-paper';
import { connect } from 'react-redux';

import { Content as ContentComponent, CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Page } from '@ts/groupPages';
import { Account, Preferences, State, Pages } from '@ts/types';
import { useTheme } from '@utils/index';

import type { PagesScreenNavigationProp } from '../../index';
import getLocalStyles from '../../styles/Styles';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  element: Pages.Element<'content'>;
  page: Page;
};

const Content: React.FC<PageProps> = ({ navigation, element }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getLocalStyles(theme);

  return (
    <View style={{ margin: 20 }}>
      <ThemeProvider
        theme={{ ...themes.light, colors: { ...themes.light.colors, text: element.data.color } }}
      >
        <ContentComponent data={element.data.content.data} parser={element.data.content.parser} />
      </ThemeProvider>
    </View>
  );
};

export default Content;
