import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, ScrollView } from 'react-native';

import { CustomHeaderBar, TranslucentStatusBar, CustomTabView } from '@components/index';
import getStyles from '@styles/Styles';
import { useTheme } from '@utils/index';

import AboutPage from '../components/AboutPage';
import LicensesPage from '../components/LicensesPage';
import SponsorsPage from '../components/SponsorsPage';
import { AboutStackParams } from '../index';

type AboutProps = StackScreenProps<AboutStackParams, 'List'>;

const About: React.FC<AboutProps> = ({ navigation, route }) => {
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
      <View style={styles.centeredPage}>
        <ScrollView>
          <CustomTabView
            initialTab={{ about: 0, sponsors: 1, licenses: 2 }[route.params?.page || 'about']}
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
                key: 'licenses',
                title: 'Licenses',
                component: <LicensesPage navigation={navigation} />,
              },
            ]}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default About;
