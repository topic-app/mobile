import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, useTheme, Divider, List } from 'react-native-paper';

import { CustomHeaderBar, TranslucentStatusBar, CustomTabView } from '@components/index';
import { handleUrl } from '@utils/index';
import TopicIcon from '@assets/images/topic-icon.svg';
import getStyles from '@styles/Styles';
import getAboutStyles from '../styles/Styles';

function About({ navigation }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const aboutStyles = getAboutStyles(theme);

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
                      <TopicIcon style={{ height: 200, width: 200 }} />
                    </View>
                  </View>
                  <View style={aboutStyles.headerContainer}>
                    <View style={styles.centerIllustrationContainer}>
                      <Text style={[styles.topic, { fontSize: 60 }]}>Topic</Text>
                    </View>
                  </View>
                  <View style={{ height: 40 }} />
                  <Divider />
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
                      <Text style={styles.link}>Conditions d'utilisation</Text>
                    </TouchableOpacity>
                    <Text> - </Text>
                    <TouchableOpacity
                      onPress={() => navigation.push('Legal', { page: 'confidentialite' })}
                    >
                      <Text style={styles.link}>Politique de confidentialité</Text>
                    </TouchableOpacity>
                  </View>
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
                      <Image
                        style={{ height: 200 }}
                        resizeMode="contain"
                        source={require('@assets/images/sponsors/mgen.png')}
                      />
                    </View>
                    <Text>
                      La Mutuelle générale de l'Éducation nationale (MGEN) est l’entreprise qui
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
                      <Image
                        style={{ height: 200 }}
                        resizeMode="contain"
                        source={require('@assets/images/sponsors/jtac.png')}
                      />
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
                      <Image
                        style={{ height: 200 }}
                        resizeMode="contain"
                        source={require('@assets/images/sponsors/esper.jpg')}
                      />
                    </View>
                    <Text>
                      L'ESTPER est un regroupement d'organisations qui agissent dans les domaines de
                      la santé, l'assurance, la banque, le médico-social, l'éducation populaire ou
                      les activités de loisirs. L'ESPER place l'économie sociale au service de
                      l'éducation.
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
                  <Divider />
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
}

export default About;

About.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func,
  }).isRequired,
};
