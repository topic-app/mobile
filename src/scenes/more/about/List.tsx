import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';

import { CustomTabView, PageContainer } from '@components';

import type { AboutStackParams } from '.';
import AboutPage from './components/AboutPage';
import LicensesPage from './components/LicensesPage';
import SponsorsPage from './components/SponsorsPage';

type AboutProps = StackScreenProps<AboutStackParams, 'List'>;

const About: React.FC<AboutProps> = ({ navigation, route }) => {
  return (
    <PageContainer headerOptions={{ title: 'À propos' }} centered scroll>
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
    </PageContainer>
  );
};

export default About;
