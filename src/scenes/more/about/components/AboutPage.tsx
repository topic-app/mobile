import React from 'react';
import { View, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Divider, List, Subheading, Text } from 'react-native-paper';

import { Content, ErrorMessage, Illustration, PlatformTouchable } from '@components/index';
import getStyles from '@styles/Styles';
import { RequestState } from '@ts/types';
import { handleUrl, useTheme } from '@utils/index';

import { AboutScreenNavigationProp } from '../index';
import getLocalStyles from '../styles/Styles';

type props = {
  navigation: AboutScreenNavigationProp<'Legal'>;
};

const AboutPage: React.FC<props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const localStyles = getLocalStyles(theme);

  const contributors = [
    {
      name: 'Tom Ruchier-Berquet',
      description: 'Président, fondateur, responsable communication',
      link: 'https://twitter.com/TomRB4',
      icon: 'twitter',
    },
    {
      name: 'Alexander Nitters',
      description: 'Trésorier, développeur, responsable technique',
      link: 'https://gitlab.com/al340',
      icon: 'gitlab',
    },
    {
      name: 'Axel Martin',
      description: 'Secrétaire général, DPO',
      link: 'https://twitter.com/Axel_Grm',
      icon: 'twitter',
    },
    {
      name: 'Benjamin Sengupta',
      description: 'Développeur, responsable frontend',
      link: 'https://gitlab.com/bensengupta',
      icon: 'gitlab',
    },
    {
      name: 'Ysée Laplanche',
      description: 'Développeuse, frontend',
      link: 'https://gitlab.com/ysee.laplanche',
      icon: 'gitlab',
    },
    {
      name: 'Romain Chardiny',
      description: 'Développeur, responsable backend',
      link: 'https://gitlab.com/romch007',
      icon: 'gitlab',
    },
    {
      name: 'Paul Giroux',
      description: 'Secrétaire général adjoint',
      link: '',
    },
    {
      name: 'Baptiste Zigmann',
      description: 'Développeur, frontend',
      link: '',
    },
    {
      name: 'Jérémy Hendrikse',
      description: 'Développeur, frontend',
      link: '',
    },
    {
      name: 'Luke Burch',
      description: 'Développeur, frontend',
    },
  ];

  return (
    <View>
      <View style={styles.contentContainer}>
        <View style={[styles.centerIllustrationContainer, { marginTop: 60, marginBottom: 10 }]}>
          <Illustration name="topic-icon" style={{ height: 200, width: 200 }} />
        </View>
      </View>
      <View style={localStyles.headerContainer}>
        <View style={styles.centerIllustrationContainer}>
          <Text style={[styles.topic, { fontSize: 60 }]}>Topic</Text>
          <Subheading>La mallette à outils de l&apos;engagement citoyen</Subheading>
        </View>
      </View>
      <View style={{ height: 40 }} />
      <View
        style={[
          { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
          styles.container,
        ]}
      >
        <TouchableOpacity onPress={() => navigation.push('Legal', { page: 'mentions' })}>
          <Text style={styles.link}>Mentions légales</Text>
        </TouchableOpacity>
        <Text> - </Text>
        <TouchableOpacity onPress={() => navigation.push('Legal', { page: 'conditions' })}>
          <Text style={styles.link}>Conditions d&apos;utilisation</Text>
        </TouchableOpacity>
        <Text> - </Text>
        <TouchableOpacity onPress={() => navigation.push('Legal', { page: 'confidentialite' })}>
          <Text style={styles.link}>Politique de confidentialité</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
      <Divider />
      <View style={styles.container}>
        <Subheading>Suivez nous sur les réseaux sociaux !</Subheading>
      </View>
      <List.Item
        title="Twitter"
        description="@topic_app"
        onPress={() => handleUrl('https://twitter.com/topic_app', { trusted: true })}
        right={() => <List.Icon icon="twitter" />}
      />
      <List.Item
        title="Instagram"
        description="@topic_application"
        onPress={() => handleUrl('https://instagram.com/topic_application', { trusted: true })}
        right={() => <List.Icon icon="instagram" />}
      />
      <List.Item
        title="Gitlab (code source)"
        description="topicapp"
        onPress={() => handleUrl('https://gitlab.com/topicapp', { trusted: true })}
        right={() => <List.Icon icon="gitlab" />}
      />
      <View style={{ height: 40 }} />
      <Divider />
      <View style={styles.contentContainer}>
        <Subheading>Équipe et contributeurs</Subheading>
      </View>
      {contributors.map((c) => (
        <List.Item
          key={c.name}
          title={c.name}
          description={c.description}
          onPress={c.link ? () => handleUrl(c.link, { trusted: true }) : undefined}
          right={c.icon ? () => <List.Icon icon={c.icon} /> : undefined}
        />
      ))}
      <View style={{ height: 40 }} />
      <Divider />
      <View style={[styles.container, { alignItems: 'center', flexDirection: 'row' }]}>
        <Illustration name="beta-welcome" height={70} width={70} />
        <Text style={{ marginLeft: 10, flex: 1 }}>
          Un grand merci à toute l&apos;équipe, aux bêta-testeurs, à nos sponsors et à tous ceux qui
          nous ont aidé à réaliser ce projet !
        </Text>
      </View>
      <View style={{ height: 40 }} />
    </View>
  );
};

export default AboutPage;
