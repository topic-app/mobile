import React from 'react';
import { View, Appearance, FlatList } from 'react-native';
import { List, Subheading, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar, Illustration, PlatformTouchable } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { Account, Preferences, State, Pages } from '@ts/types';
import { useSafeAreaInsets, useTheme } from '@utils/index';

import type { PagesScreenNavigationProp } from '../index';
import getSettingsStyles from '../styles/Styles';
import AboutModal from './AboutModal';
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

  const [aboutVisible, setAboutVisible] = React.useState(false);

  const items = [...page.header, ...page.content, ...page.footer];

  return (
    <View style={styles.page}>
      <FlatList
        nestedScrollEnabled
        data={items}
        renderItem={({ item }) => {
          const B = Backgrounds[item.type];
          return <B navigation={navigation} background={item} />;
        }}
        ListFooterComponent={() => (
          <PlatformTouchable
            style={[
              styles.container,
              {
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
            onPress={() => setAboutVisible(true)}
          >
            <View style={{ marginRight: 10 }}>
              <Illustration name="topic-icon" height={30} width={30} />
            </View>
            <Subheading>Créé avec Topic</Subheading>
          </PlatformTouchable>
        )}
      />
      <AboutModal visible={aboutVisible} setVisible={setAboutVisible} navigation={navigation} />
    </View>
  );
};

export default Page;
