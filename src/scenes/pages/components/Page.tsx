import React from 'react';
import {
  View,
  Appearance,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { List, ProgressBar, Subheading, Text, ThemeProvider } from 'react-native-paper';
import { connect } from 'react-redux';

import { CustomHeaderBar, Illustration, PlatformTouchable } from '@components/index';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { BackgroundNames, Page as PageType } from '@ts/groupPages';
import { Account, Preferences, State, Pages } from '@ts/types';
import { useSafeAreaInsets, useTheme } from '@utils/index';

import type { PagesScreenNavigationProp } from '../index';
import getSettingsStyles from '../styles/Styles';
import AboutModal from './AboutModal';
import Color from './backgrounds/Color';
import Gradient from './backgrounds/Gradient';
import Image from './backgrounds/Image';
import Loader from './backgrounds/Loader';

type PageProps = {
  navigation: PagesScreenNavigationProp<any>;
  page: Pages.Page;
  header: Pages.Background<BackgroundNames>[];
  footer: Pages.Background<BackgroundNames>[];
  loading?: boolean;
};

const Page: React.FC<PageProps> = ({ navigation, page, loading, header, footer }) => {
  const theme = themes.light;
  const styles = getStyles(theme);
  const localStyles = getSettingsStyles(theme);
  const { colors } = theme;

  const Backgrounds = {
    image: Image,
    color: Color,
    gradient: Gradient,
    loader: Loader,
  } as Record<
    BackgroundNames,
    React.FC<{
      navigation: PagesScreenNavigationProp<any>;
      background: Pages.Background<BackgroundNames>;
      page: PageType;
      loading?: boolean;
    }>
  >;

  const [aboutVisible, setAboutVisible] = React.useState(false);

  const items = [...(header || []), ...(loading ? [] : page.content || [])];

  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <ThemeProvider theme={themes.light}>
      <View style={styles.page}>
        <FlatList
          nestedScrollEnabled
          data={items}
          renderItem={({ item }) => {
            const B = Backgrounds[item.type];
            return <B navigation={navigation} background={item} page={page} loading={loading} />;
          }}
          contentContainerStyle={{
            minHeight: dimensions.height - insets.bottom,
          }}
          ListFooterComponentStyle={{
            flex: 1,
            justifyContent: 'flex-end',
          }}
          ListFooterComponent={() => (
            <View
              style={{
                flex: 1,
                flexGrow: 1,
                justifyContent: 'flex-end',
              }}
            >
              {footer.map((item) => {
                const B = Backgrounds[item.type];
                return (
                  <B navigation={navigation} background={item} page={page} loading={loading} />
                );
              })}
              <PlatformTouchable
                style={[
                  styles.container,
                  {
                    flexDirection: 'row',
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
            </View>
          )}
        />
        <AboutModal visible={aboutVisible} setVisible={setAboutVisible} navigation={navigation} />
      </View>
    </ThemeProvider>
  );
};

export default Page;
