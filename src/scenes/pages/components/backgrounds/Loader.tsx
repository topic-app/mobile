import React from 'react';
import { View, Appearance, FlatList, ActivityIndicator } from 'react-native';
import {
  List,
  ProgressBar,
  Text,
  ActivityIndicator as PaperActivityIndicator,
} from 'react-native-paper';
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
  background: Pages.Background<'loader'>;
  page: Page;
  loading?: boolean;
};

const Loader: React.FC<PageProps> = ({ navigation, background, page, loading }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getLocalStyles(theme);

  if (!loading) return null;

  return (
    <View style={{ backgroundColor: background.data.backgroundColor }}>
      {background.data.type === 'bar' && (
        <ProgressBar indeterminate color={background.data.color} />
      )}
      {background.data.type === 'spinner' && (
        <View style={{ margin: 10 }}>
          <ActivityIndicator size="large" color={background.data.color} />
        </View>
      )}
      {background.data.type === 'paper' && (
        <View style={{ margin: 10 }}>
          <PaperActivityIndicator size="large" color={background.data.color} />
        </View>
      )}
    </View>
  );
};

export default Loader;
