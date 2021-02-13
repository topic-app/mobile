import React from 'react';
import { View, Appearance, FlatList, ScrollView } from 'react-native';
import { Card, List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  Content as ContentComponent,
  ContentTabView as ContentTabViewComponent,
  CustomHeaderBar,
} from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Account, Preferences, State, Pages } from '@ts/types';
import { useTheme } from '@utils/index';

import type { PagesScreenNavigationProp } from '../../index';
import getLocalStyles from '../../styles/Styles';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  element: Pages.Element<'contentTabView'>;
};

const ContentTabView: React.FC<PageProps> = ({ navigation, element }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getLocalStyles(theme);

  return (
    <View style={{ flex: 1 }}>
      <Card theme={themes[element.data.theme]}>
        <ScrollView
          style={{ flex: 1, maxHeight: element.data.maxHeight || 500 }} // TODO: Figure out nested scroll
        >
          <ContentTabViewComponent searchParams={element.data.params} />
        </ScrollView>
      </Card>
    </View>
  );
};

export default ContentTabView;
