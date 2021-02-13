import React from 'react';
import { View, Appearance, FlatList } from 'react-native';
import { List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Account, Preferences, State, Pages } from '@ts/types';
import { useTheme } from '@utils/index';

import type { PagesScreenNavigationProp } from '../../index';
import getLocalStyles from '../../styles/Styles';
import Block from '../Block';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  background: Pages.Background<'color'>;
};

const Color: React.FC<PageProps> = ({ navigation, background }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getLocalStyles(theme);

  return (
    <View style={{ backgroundColor: background.data.color, minHeight: background.minHeight }}>
      <Block navigation={navigation} columns={background.columns} />
    </View>
  );
};

export default Color;
