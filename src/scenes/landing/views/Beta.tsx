import React from 'react';
import { View, Platform, ScrollView, Linking } from 'react-native';
import { Text, Button, List, Checkbox } from 'react-native-paper';

import { TranslucentStatusBar, Illustration, SafeAreaView, StepperView } from '@components/index';
import getStyles from '@styles/Styles';
import { firebase } from '@utils/firebase';
import { useTheme } from '@utils/index';

import type { LandingScreenNavigationProp } from '../index';
import getLandingStyles from '../styles/Styles';

type LandingArticlesProps = {
  navigation: LandingScreenNavigationProp<'Beta'>;
};

const LandingArticles: React.FC<LandingArticlesProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);
  const landingStyles = getLandingStyles(theme);

  const [terms, setTerms] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <ScrollView>
          <StepperView
            pages={[
              {
                key: 'welcome',
                icon: 'beta',
                title: 'Bêta',
                component: ({ next }) => (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="beta-welcome" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Topic · Bêta ouverte</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>Merci d&apos;avoir rejoint la bêta ouverte de Topic !{'\n'}</Text>
                      <Text>
                        Avant de commencer, nous aimerions vous donner quelques explications sur le
                        processus de rapport de bugs et de demandes de fonctionnalités.{'\n'}
                      </Text>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <View style={landingStyles.buttonContainer}>
                        <Button
                          mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                          color={colors.primary}
                          uppercase={Platform.OS !== 'ios'}
                          onPress={() => next(1)}
                          style={{ flex: 1 }}
                        >
                          Suivant
                        </Button>
                      </View>
                    </View>
                  </View>
                ),
              },
              {
                key: 'privacy',
                title: 'Données',
                icon: 'shield',
                component: ({ next }) => (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="beta-privacy" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Vie privée et conditions</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>
                        La bêta de l&apos;application Topic est soumise à certaines conditions
                        supplémentaires par rapport à la version finale. Nous collectons notamment
                        plus de données sur votre appareil afin de faciliter la correction de bugs.
                        Vous pouvez voir les{' '}
                        <Text
                          style={styles.link}
                          onPress={() => Linking.openURL('https://beta.topicapp.fr/legal/terms')}
                        >
                          Conditions d&apos;Utilisation
                        </Text>{' '}
                        et la{' '}
                        <Text
                          style={styles.link}
                          onPress={() => Linking.openURL('https://beta.topicapp.fr/legal/privacy')}
                        >
                          Politique de Vie Privée
                        </Text>{' '}
                        pour plus de détails.
                      </Text>
                      <Text>
                        Vous pouvez choisir d&apos;activer l&apos;envoi de données analytiques (par
                        le biais du service Google Firebase Analytics). Nous recevrons alors des
                        informations sur les actions que vous faites sur l&apos;application (les
                        contenus que vous visitez, vos paramètres, etc)
                      </Text>
                      <List.Item
                        title="J'accepte les conditions d'utilisation et la politique de vie privée"
                        titleNumberOfLines={10}
                        left={() =>
                          Platform.OS !== 'ios' ? (
                            <Checkbox
                              status={terms ? 'checked' : 'unchecked'}
                              color={colors.primary}
                            />
                          ) : null
                        }
                        right={() =>
                          Platform.OS === 'ios' ? (
                            <Checkbox
                              status={terms ? 'checked' : 'unchecked'}
                              color={colors.primary}
                            />
                          ) : null
                        }
                        onPress={() => setTerms(!terms)}
                      />
                      <List.Item
                        title="Je souhaite envoyer des données analytiques supplémentaires (facultatif)"
                        titleNumberOfLines={10}
                        left={() =>
                          Platform.OS !== 'ios' ? (
                            <Checkbox
                              status={analytics ? 'checked' : 'unchecked'}
                              color={colors.primary}
                            />
                          ) : null
                        }
                        right={() =>
                          Platform.OS === 'ios' ? (
                            <Checkbox
                              status={analytics ? 'checked' : 'unchecked'}
                              color={colors.primary}
                            />
                          ) : null
                        }
                        onPress={() => setAnalytics(!analytics)}
                      />
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <View style={landingStyles.buttonContainer}>
                        <Button
                          mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                          disabled={!terms}
                          color={colors.primary}
                          uppercase={Platform.OS !== 'ios'}
                          onPress={async () => {
                            if (Platform.OS !== 'web') {
                              if (analytics) {
                                await firebase.analytics().setAnalyticsCollectionEnabled(true);
                              }
                            }
                            next(1);
                          }}
                          style={{ flex: 1 }}
                        >
                          Suivant
                        </Button>
                      </View>
                    </View>
                  </View>
                ),
              },
              {
                key: 'bugs',
                icon: 'bug',
                title: 'Bugs',
                component: ({ next }) => (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="beta-bugs" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Bugs et plantages</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>
                        Étant donné que l&apos;application est toujours en bêta, elle risque de
                        planter assez fréquemment, et vous rencontrerez sûrement des bugs.{'\n'}
                      </Text>
                      <Text>
                        Les plantages seront reportés automatiquement, toutefois si vous constatez
                        un bug d&apos;affichage, une fonctionnalité qui ne marche pas correctement,
                        ou un autre problème, nous vous demandons de bien vouloir nous donner les
                        détails.{'\n'}Vous pouvez faire cela en recherchant l&apos;application Topic
                        sur le Play Store ou en cliquant sur &quot;Feedback&quot; dans le menu, et
                        en cliquant sur &quot;envoyer des commentaires aux développeurs&quot;.{'\n'}
                      </Text>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <View style={landingStyles.buttonContainer}>
                        <Button
                          mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                          color={colors.primary}
                          uppercase={Platform.OS !== 'ios'}
                          onPress={() => next(1)}
                          style={{ flex: 1 }}
                        >
                          Suivant
                        </Button>
                      </View>
                    </View>
                  </View>
                ),
              },
              {
                key: 'messaging',
                icon: 'message',
                title: 'Comm',
                component: ({ next }) => (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="beta-messages" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Communication</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>
                        Si vous souhaitez discuter avec les développeurs et les autres
                        bêta-testeurs, nous vous conseillons de rejoindre la plateforme
                        chat.topicapp.fr ou le groupe Telegram. Ces plateformes sont entièrement
                        facultatives, toutefois ils vous permettront de donner votre avis plus
                        facilement.
                      </Text>
                      <Button
                        mode={Platform.OS === 'ios' ? 'text' : 'outlined'}
                        color={colors.primary}
                        uppercase={false}
                        onPress={() =>
                          Linking.openURL('https://chat.topicapp.fr/register/cYd2Rw3eaBfYnvoZy')
                        }
                        style={{ flex: 1, marginTop: 20 }}
                      >
                        Rejoindre chat.topicapp.fr
                      </Button>
                      <Button
                        mode={Platform.OS === 'ios' ? 'text' : 'outlined'}
                        color={colors.primary}
                        uppercase={false}
                        onPress={() =>
                          Linking.openURL('https://t.me/joinchat/EweXREpNp7G6Uzl6nkMThQ')
                        }
                        style={{ flex: 1, marginTop: 20 }}
                      >
                        Rejoindre le groupe Telegram
                      </Button>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <View style={landingStyles.buttonContainer}>
                        <Button
                          mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                          color={colors.primary}
                          uppercase={Platform.OS !== 'ios'}
                          onPress={() => next(1)}
                          style={{ flex: 1 }}
                        >
                          Suivant
                        </Button>
                      </View>
                    </View>
                  </View>
                ),
              },
              {
                key: 'updates',
                icon: 'cellphone-arrow-down',
                title: 'Mises à jour',
                component: () => (
                  <View>
                    <View style={landingStyles.headerContainer}>
                      <View style={landingStyles.centerIllustrationContainer}>
                        <Illustration name="beta-updates" height={300} width={300} />
                        <Text style={landingStyles.sectionTitle}>Mises à jour et tests</Text>
                      </View>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <Text>
                        Nous publierons des mises à jour sur le Play Store toutes les semaines
                        environ. N&apos;hésitez pas à regarder les notes de mise à jour pour voir
                        quelles fonctionnalités vous pouvez tester.{'\n'}
                      </Text>
                      <Text>
                        Nous vous demandons de ne pas publier de &apos;contenus de test&apos; sur le
                        serveur principal. En renvanche, vous pouvez activer l&apos;option
                        &quot;utiliser le serveur de développement&quot; dans les paramètres bêta si
                        vous voulez le faire. Assurez vous bien que la bannière &quot;Serveur de
                        développement&quot; est affiché avant de publier un contenu de test.{'\n'}
                      </Text>
                      <Text>Bon bêta-testing !</Text>
                    </View>
                    <View style={landingStyles.contentContainer}>
                      <View style={landingStyles.buttonContainer}>
                        <Button
                          mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                          color={colors.primary}
                          uppercase={Platform.OS !== 'ios'}
                          onPress={() =>
                            navigation.navigate('Landing', { screen: 'SelectLocation' })
                          }
                          style={{ flex: 1 }}
                        >
                          Commencer
                        </Button>
                      </View>
                    </View>
                  </View>
                ),
              },
            ]}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default LandingArticles;
