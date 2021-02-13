import React from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Divider, List, Subheading } from 'react-native-paper';

import {
  CustomHeaderBar,
  Illustration,
  TranslucentStatusBar,
  CustomTabView,
  PlatformTouchable,
} from '@components/index';
import getStyles from '@styles/Styles';
import { useTheme, handleUrl } from '@utils/index';

import AboutPage from '../components/AboutPage';
import LicensesPage from '../components/LicensesPage';
import SponsorsPage from '../components/SponsorsPage';
import { AboutScreenNavigationProp } from '../index';
import getAboutStyles from '../styles/Styles';

type AboutProps = {
  navigation: AboutScreenNavigationProp<'Legal'>;
};

const About: React.FC<AboutProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <CustomHeaderBar
        scene={{
          descriptor: {
            options: {
              title: 'À propos',
            },
          },
        }}
      />
      <ScrollView>
        <CustomTabView
          scrollEnabled={false}
          pages={[
            {
              key: 'about',
              title: 'À propos',
              component: <AboutPage navigation={navigation} />,
            },
            {
              key: 'sponsors',
              title: 'Partenaires',
              component: <SponsorsPage />,
            },
            {
              key: 'Licenses',
              title: 'Licenses',
              component: <LicensesPage navigation={navigation} />,
            },
          ]}
        />
      </ScrollView>
    </View>
  );
};

export default About;
