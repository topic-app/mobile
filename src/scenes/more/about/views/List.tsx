import React from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Divider, List, Subheading } from 'react-native-paper';

import {
  CustomHeaderBar,
  Illustration,
  TranslucentStatusBar,
  CustomTabView,
} from '@components/index';
import getStyles from '@styles/Styles';
import { useTheme, handleUrl } from '@utils/index';

import { AboutScreenNavigationProp } from '../index';
import getAboutStyles from '../styles/Styles';

type AboutProps = {
  navigation: AboutScreenNavigationProp<'Legal'>;
};

const image_mgen = require('@assets/images/sponsors/mgen.png');
const image_jtac = require('@assets/images/sponsors/jtac.png');
const image_esper = require('@assets/images/sponsors/esper.jpg');

const About: React.FC<AboutProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const aboutStyles = getAboutStyles(theme);

  const contributors = [
    {
      name: 'Tom Ruchier-Berquet',
      description: 'Président',
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
              title: 'A propos',
              component: (
                <View>
                  <View style={styles.contentContainer}>
                    <View
                      style={[
                        styles.centerIllustrationContainer,
                        { marginTop: 60, marginBottom: 10 },
                      ]}
                    >
                      <Illustration name="topic-icon" style={{ height: 200, width: 200 }} />
                    </View>
                  </View>
                  <View style={aboutStyles.headerContainer}>
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
                    <TouchableOpacity
                      onPress={() => navigation.push('Legal', { page: 'mentions' })}
                    >
                      <Text style={styles.link}>Mentions légales</Text>
                    </TouchableOpacity>
                    <Text> - </Text>
                    <TouchableOpacity
                      onPress={() => navigation.push('Legal', { page: 'conditions' })}
                    >
                      <Text style={styles.link}>Conditions d&apos;utilisation</Text>
                    </TouchableOpacity>
                    <Text> - </Text>
                    <TouchableOpacity
                      onPress={() => navigation.push('Legal', { page: 'confidentialite' })}
                    >
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
                    onPress={() => handleUrl('https://twitter.com/topic_app')}
                    right={() => <List.Icon icon="twitter" />}
                  />
                  <List.Item
                    title="Instagram"
                    description="@topic_application"
                    onPress={() => handleUrl('https://instagram.com/topic_application')}
                    right={() => <List.Icon icon="twitter" />}
                  />
                  <List.Item
                    title="Gitlab (code source)"
                    description="topicapp"
                    onPress={() => handleUrl('https://gitlab.com/topicapp')}
                    right={() => <List.Icon icon="gitlab" />}
                  />
                  <View style={{ height: 40 }} />
                  <Divider />
                  <View style={styles.contentContainer}>
                    <Subheading>Équipe et contributeurs</Subheading>
                  </View>
                  {contributors.map((c) => (
                    <List.Item
                      title={c.name}
                      description={c.description}
                      onPress={c.link ? () => handleUrl(c.link) : undefined}
                      right={c.icon ? () => <List.Icon icon={c.icon} /> : undefined}
                    />
                  ))}
                  <View style={{ height: 40 }} />
                  <Divider />
                  <View style={[styles.container, { alignItems: 'center', flexDirection: 'row' }]}>
                    <Illustration name="beta-welcome" height={70} width={70} />
                    <Text style={{ marginLeft: 10, flex: 1 }}>
                      Un grand merci à toute l&apos;équipe, aux bêta-testeurs, à nos sponsors et à
                      tous ceux qui nous ont aidé à réaliser ce projet !
                    </Text>
                  </View>
                  <View style={{ height: 40 }} />
                </View>
              ),
            },
            {
              key: 'sponsors',
              title: 'Sponsors',
              component: (
                <View>
                  <View style={aboutStyles.headerContainer}>
                    <View style={styles.centerIllustrationContainer}>
                      <Text style={aboutStyles.sectionTitle}>Sponsors</Text>
                    </View>
                  </View>
                  <View style={styles.contentContainer}>
                    <Divider />
                    <View
                      style={[
                        styles.centerIllustrationContainer,
                        { marginTop: 60, marginBottom: 10 },
                      ]}
                    >
                      <Image style={{ height: 200 }} resizeMode="contain" source={image_mgen} />
                    </View>
                    <Text>
                      La Mutuelle générale de l&apos;Éducation nationale (MGEN) est l’entreprise qui
                      finance l’application, au niveau des frais de serveur, de publication et des
                      frais associatifs. Nous les remercions sincèrement pour cette aide qui nous
                      permet de proposer une application gratuite et sans publicité.
                    </Text>
                    <Divider style={{ marginTop: 20 }} />
                    <View
                      style={[
                        styles.centerIllustrationContainer,
                        { marginTop: 60, marginBottom: 10 },
                      ]}
                    >
                      <Image style={{ height: 200 }} resizeMode="contain" source={image_jtac} />
                    </View>
                    <Text>
                      La Jeunesse des Territoires pour l’Action Culturelle (JTAC) est une
                      association dont le but est de promouvoir l’accès à la culture et l’engagement
                      lycéen. C’est une association qui s’aligne parfaitement avec les buts de notre
                      application, et nous avons donc décidé de développer l’application en
                      partenariat avec celle-ci.
                    </Text>
                    <Divider style={{ marginTop: 20 }} />
                    <View
                      style={[
                        styles.centerIllustrationContainer,
                        { marginTop: 60, marginBottom: 10 },
                      ]}
                    >
                      <Image style={{ height: 200 }} resizeMode="contain" source={image_esper} />
                    </View>
                    <Text>
                      L&apos;ESPER est un regroupement d&apos;organisations qui agissent dans les
                      domaines de la santé, l&apos;assurance, la banque, le médico-social,
                      l&apos;éducation populaire ou les activités de loisirs. L&apos;ESPER place
                      l&apos;économie sociale au service de l&apos;éducation.
                    </Text>
                  </View>
                </View>
              ),
            },
            {
              key: 'Licenses',
              title: 'Licenses',
              component: (
                <View>
                  <View style={styles.contentContainer}>
                    <Subheading>Topic</Subheading>
                    <Text>
                      L&apos;application Topic est un logiciel libre, vous pouvez trouver le code
                      source sur la page{' '}
                      <Text
                        style={styles.link}
                        onPress={() => handleUrl('https://gitlab.com/topicapp/mobile')}
                      >
                        https://gitlab.com/topicapp/mobile
                      </Text>
                      .{'\n'}N&apos;hésitez pas à regarder et à contribuer si vous en avez envie,
                      nous pourrons vous aider si besoin. {'\n\n'}
                      Topic Mobile Copyright (C) 2020 Topic App (W061014585) {'\n'}This program is
                      free software: you can redistribute it and/or modify it under the terms of the
                      GNU Affero General Public License as published by the Free Software
                      Foundation, either version 3 of the License, or (at your option) any later
                      version. {'\n'}This program is distributed in the hope that it will be useful,
                      but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
                      or FITNESS FOR A PARTICULAR PURPOSE. {'\n'}See the GNU Affero General Public
                      License for more details. You should have received a copy of the GNU Affero
                      General Public License along with this program. If not, see
                      https://www.gnu.org/licenses/.
                    </Text>
                  </View>
                  <View style={{ height: 40 }} />
                  <Divider />
                  <View style={styles.contentContainer}>
                    <Subheading>Librairies et ressources</Subheading>
                    <Text>
                      Nous remercions les projets et les personnes qui nous ont fournit les outils
                      et éléments nécéssaires à cet application.{'\n'}Pour tous les projets
                      open-source, vous trouverez ci-dessous des liens vers chacun des projets et la
                      license sous laquelle elle se trouve.
                    </Text>
                  </View>
                  <List.Item
                    title="Logo et ressources"
                    description="© Ella Nitters (ellanitters.com)"
                    onPress={() => handleUrl('https://ellanitters.com')}
                    right={() => <List.Icon icon="open-in-new" />}
                  />
                  <List.Item
                    title="Illustrations"
                    description="© Katerina Limpitsouni (undraw.co)"
                    onPress={() => handleUrl('https://undraw.co')}
                    right={() => <List.Icon icon="open-in-new" />}
                  />
                  <List.Item
                    title="Données cartographiques"
                    description="© OpenMapTiles © OpenStreetMap Contributors"
                    onPress={() => handleUrl('https://openstreetmap.org/copyright')}
                    right={() => <List.Icon icon="open-in-new" />}
                  />
                  <List.Item
                    title="Librairies"
                    description="Toutes les licenses open-source"
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={() => navigation.navigate('Licenses', { page: 'full' })}
                  />
                </View>
              ),
            },
          ]}
        />
      </ScrollView>
    </View>
  );
};

export default About;
