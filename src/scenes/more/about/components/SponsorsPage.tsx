import React from 'react';
import { View, Image } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';

import sponsors from '@assets/json/sponsors.json';
import { handleUrl } from '@utils';

import getStyles from '../styles';

const sponsorsWithImages = sponsors.map((sponsor) => ({
  ...sponsor,
  image: {
    mgen: require('@assets/images/sponsors/mgen.png'),
    lesper: require('@assets/images/sponsors/esper.jpg'),
    edtech: require('@assets/images/sponsors/edtech.png'),
    solidarsport: require('@assets/images/sponsors/solidarsport.jpg'),
  }[sponsor.id as 'mgen' | 'solidarsport' | 'edtech' | 'lesper'],
}));

const SponsorsPage: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.centerIllustrationContainer}>
          <Text style={styles.sectionTitle}>Partenaires</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        {sponsorsWithImages.map((sponsor) => (
          <View key={sponsor.id}>
            <Divider style={{ marginTop: 20 }} />
            <View style={[styles.centerImageContainer, { marginTop: 60, marginBottom: 10 }]}>
              <Image style={{ height: 200 }} resizeMode="contain" source={sponsor.image} />
            </View>
            <Text>{sponsor.description}</Text>
            {sponsor.url ? (
              <Text>
                Plus d&apos;infos sur{' '}
                <Text onPress={() => handleUrl(sponsor.url, { trusted: true })} style={styles.link}>
                  {sponsor.url.split('://')[1]}
                </Text>
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};

export default SponsorsPage;
