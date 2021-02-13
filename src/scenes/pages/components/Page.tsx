import React from 'react';
import { View, Appearance, FlatList } from 'react-native';
import { List, Subheading, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar, Illustration } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Account, Preferences, State, Pages } from '@ts/types';
import { useSafeAreaInsets, useTheme } from '@utils/index';

import type { PagesScreenNavigationProp } from '../index';
import getSettingsStyles from '../styles/Styles';
import Color from './backgrounds/Color';
import Gradient from './backgrounds/Gradient';
import Image from './backgrounds/Image';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  page: Pages.Page;
};

const Page: React.FC<PageProps> = ({ navigation, page }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getSettingsStyles(theme);

  const Backgrounds = {
    image: Image,
    color: Color,
    gradient: Gradient,
  };

  return (
    <View style={styles.page}>
      <FlatList
        nestedScrollEnabled
        data={page.content}
        renderItem={({ item }) => {
          const B = Backgrounds[item.type];
          return <B navigation={navigation} background={item} />;
        }}
        ListFooterComponent={() => (
          <View
            style={[
              styles.container,
              {
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <View style={{ marginRight: 10 }}>
              <Illustration name="topic-icon" height={40} width={40} />
            </View>
            <Subheading>Créé avec Topic</Subheading>
          </View>
        )}
      />
    </View>
  );
};

export default Page;
