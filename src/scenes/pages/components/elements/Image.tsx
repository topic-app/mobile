import React from 'react';
import {
  View,
  Appearance,
  FlatList,
  useWindowDimensions,
  Image as ImageComponent,
} from 'react-native';
import { List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { Content as ContentComponent, CustomHeaderBar } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Page } from '@ts/groupPages';
import { Account, Preferences, State, Pages } from '@ts/types';
import AutoHeightImage from '@utils/autoHeightImage';
import { getImageUrl, useTheme } from '@utils/index';

import type { PagesScreenNavigationProp } from '../../index';
import getLocalStyles from '../../styles/Styles';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  element: Pages.Element<'image'>;
  page: Page;
};

const Image: React.FC<PageProps> = ({ navigation, element }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getLocalStyles(theme);

  const dimensions = useWindowDimensions();

  return (
    <View style={{ alignSelf: 'stretch', margin: 20 }}>
      <ImageComponent
        source={{ uri: getImageUrl({ image: element.data.image, size: 'full' }) }}
        resizeMode={element.data.mode}
        style={{ height: element.data.height }}
      />
    </View>
  );
};

export default Image;
