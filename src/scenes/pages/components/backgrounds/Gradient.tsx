import React from 'react';
import { View, Appearance, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Page } from '@ts/groupPages';
import { Account, Preferences, State, Pages } from '@ts/types';
import { useTheme } from '@utils/index';

import type { PagesScreenNavigationProp } from '../../index';
import getLocalStyles from '../../styles/Styles';
import Block from '../Block';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  background: Pages.Background<'gradient'>;
  page: Page;
};

const Gradient: React.FC<PageProps> = ({ navigation, background, page }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getLocalStyles(theme);

  return (
    <View>
      <LinearGradient
        colors={[background.data.start, background.data.end]}
        style={{
          minHeight: background.minHeight,
        }}
        useAngle
        angle={background.data.angle || 0}
        angleCenter={{ x: 0.5, y: 0.5 }}
      >
        <Block navigation={navigation} columns={background.columns} page={page} />
      </LinearGradient>
    </View>
  );
};

export default Gradient;
