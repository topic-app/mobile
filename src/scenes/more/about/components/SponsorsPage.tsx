import React from 'react';
import { View, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Divider, Text } from 'react-native-paper';

import { Content, ErrorMessage, PlatformTouchable } from '@components/index';
import getStyles from '@styles/Styles';
import { RequestState } from '@ts/types';
import { handleUrl, useTheme } from '@utils/index';

import getLocalStyles from '../styles/Styles';

const image_mgen = require('@assets/images/sponsors/mgen.png');
const image_jtac = require('@assets/images/sponsors/jtac.png');
const image_esper = require('@assets/images/sponsors/esper.jpg');
const image_edtech = require('@assets/images/sponsors/edtech.png');

const SponsorsPage: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getLocalStyles(theme);

  return (
    <View>
      <View style={localStyles.headerContainer}>
        <View style={styles.centerIllustrationContainer}>
          <Text style={localStyles.sectionTitle}>Partenaires</Text>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Divider />
        <View style={[styles.centerImageContainer, { marginTop: 60, marginBottom: 10 }]}>
          <Image style={{ height: 200 }} resizeMode="contain" source={image_mgen} />
        </View>
        <Text>
          La Mutuelle générale de l&apos;Éducation nationale (MGEN) est l’entreprise qui finance
          l’application, au niveau des frais de serveur, de publication et des frais associatifs.
          Nous les remercions sincèrement pour cette aide qui nous permet de proposer une
          application gratuite et sans publicité.
        </Text>
        <Text>
          Plus d&apos;infos sur{' '}
          <Text onPress={() => handleUrl('https://mgen.fr', { trusted: true })} style={styles.link}>
            mgen.fr
          </Text>
        </Text>
        <Divider style={{ marginTop: 20 }} />
        <View style={[styles.centerImageContainer, { marginTop: 60, marginBottom: 10 }]}>
          <Image style={{ height: 200 }} resizeMode="contain" source={image_edtech} />
        </View>
        <Text>
          L&apos;association EdTech France fédère les entreprises françaises qui ont décidé de
          rendre la technologie et l&apos;innovation utiles à l&apos;éducation, à
          l&apos;enseignement supérieur et à la formation tout au long de la vie.
        </Text>
        <Text>
          Plus d&apos;infos sur{' '}
          <Text
            onPress={() => handleUrl('https://edtechfrance.fr', { trusted: true })}
            style={styles.link}
          >
            edtechfrance.fr
          </Text>
        </Text>
        <Divider style={{ marginTop: 20 }} />
        <View style={[styles.centerImageContainer, { marginTop: 60, marginBottom: 10 }]}>
          <Image style={{ height: 200 }} resizeMode="contain" source={image_jtac} />
        </View>
        <Text>
          La Jeunesse des Territoires pour l’Action Culturelle (JTAC) est une association dont le
          but est de promouvoir l’accès à la culture et l’engagement lycéen. C’est une association
          qui s’aligne parfaitement avec les buts de notre application, et nous avons donc décidé de
          développer l’application en partenariat avec celle-ci.
        </Text>
        <Divider style={{ marginTop: 20 }} />
        <View style={[styles.centerImageContainer, { marginTop: 60, marginBottom: 10 }]}>
          <Image style={{ height: 200 }} resizeMode="contain" source={image_esper} />
        </View>
        <Text>
          L&apos;ESPER est un regroupement d&apos;organisations qui agissent dans les domaines de la
          santé, l&apos;assurance, la banque, le médico-social, l&apos;éducation populaire ou les
          activités de loisirs. L&apos;ESPER place l&apos;économie sociale au service de
          l&apos;éducation.
        </Text>
        <Text>
          Plus d&apos;infos sur{' '}
          <Text
            style={styles.link}
            onPress={() => handleUrl('https://lesper.fr', { trusted: true })}
          >
            lesper.fr
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SponsorsPage;
