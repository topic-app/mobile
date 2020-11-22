import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, Platform, Image, ScrollView } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';

import {
  PlatformBackButton,
  CustomTabView,
  TranslucentStatusBar,
  Illustration,
  SafeAreaView,
} from '@components/index';
import getStyles from '@styles/Styles';
import { useTheme } from '@utils/index';

import type { LandingStackParams } from '../index';
import getLandingStyles from '../styles/Styles';

type LandingArticlesProps = StackScreenProps<LandingStackParams, 'Info'>;

const LandingArticles: React.FC<LandingArticlesProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const landingStyles = getLandingStyles(theme);
  const viewpagerRef = React.createRef();

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <ScrollView>
          <PlatformBackButton onPress={navigation.goBack} />
          <CustomTabView
            hideTabIndicator
            initialTab={route.params.index}
            pages={[
              {
                key: 'articles',
                title: 'Articles',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="article" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Articles</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>
                        Au travers de cette fonctionnalité, vous pourrez écrire des articles,
                        détailler vos projets, votre engagement, qu’il vous sera possible de
                        partager au reste de la communauté au travers d’un outil de recherche
                        personnalisée.
                      </Text>
                      <Text>
                        Aimez, commentez, partagez, donnez un nouveau souffle à la presse de la
                        jeunesse !
                      </Text>
                    </View>
                  </View>
                ),
              },
              {
                key: 'events',
                title: 'Évènements',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="event" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Évènements</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>
                        Ici vous pourrez mettre en avant vos actions, vos évènements et vos
                        rassemblements, en préciser les modalités et les mettre en lumière. Partez
                        aussi à la recherche de ces derniers avec un outil dédié et personnalisable.
                      </Text>
                      <Text>Vers l’engagement de tous et pour tous !</Text>
                    </View>
                  </View>
                ),
              },
              /* {
                key: 'petitions',
                title: 'Pétitions',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="petition" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Pétitions</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>Some long and boring description</Text>
                    </View>
                  </View>
                ),
              }, */
              {
                key: 'explore',
                title: 'Explorer',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="explore" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Explorer</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>
                        Nous vous proposons une carte interactive des territoires français, où
                        seront répertoriés, avec votre aide, les lieux culturels, les établissements
                        scolaires et où apparaîtront vos évènements et ceux de la communauté.
                      </Text>
                      <Text>En avant la culture ! En avant l’engagement !</Text>
                    </View>
                  </View>
                ),
              },
              {
                key: 'groups',
                title: 'Groupes',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="group" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Groupes</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>
                        Rejoignez des groupes, des associations et des clubs pour écrire des
                        articles et créer des évènements.
                      </Text>
                    </View>
                  </View>
                ),
              },
              {
                key: 'sponsors',
                title: 'Sponsors',
                component: (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Text style={landingStyles.sectionTitle}>Sponsors</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Divider />
                      <View
                        style={[
                          landingStyles.centerIllustrationContainer,
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
                          landingStyles.centerIllustrationContainer,
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
                        association dont le but est de promouvoir l’accès à la culture et
                        l’engagement lycéen. C’est une association qui s’aligne parfaitement avec
                        les buts de notre application, et nous avons donc décidé de développer
                        l’application en partenariat avec celle-ci.
                      </Text>
                      <Divider style={{ marginTop: 20 }} />
                      <View
                        style={[
                          landingStyles.centerIllustrationContainer,
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
                        L'ESTPER est un regroupement d'organisations qui agissent dans les domaines
                        de la santé, l'assurance, la banque, le médico-social, l'éducation populaire
                        ou les activités de loisirs. L'ESPER place l'économie sociale au service de
                        l'éducation.
                      </Text>
                    </View>
                  </View>
                ),
              },
            ]}
          />
        </ScrollView>
        <Divider />
        <View style={landingStyles.contentContainer}>
          <View style={landingStyles.buttonContainer}>
            <Button
              mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
              color={colors.primary}
              uppercase={Platform.OS !== 'ios'}
              onPress={() => navigation.navigate('Landing', { screen: 'Beta' })} // TODO: This should point to the second view of the viewpager
              style={{ flex: 1 }}
            >
              Suivant
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LandingArticles;
